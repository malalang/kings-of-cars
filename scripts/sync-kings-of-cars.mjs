#!/usr/bin/env node

/**
 * Sync the public King of Cars inventory into Supabase.
 *
 * This intentionally uses only public website data and the Supabase service
 * role key on the server/CI side. It does not weaken RLS and never writes the
 * service-role credential to client code.
 *
 * Required env:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 *   KINGS_OF_CARS_SOURCE_URL=https://www.kingofcars.co.za/
 *   KINGS_OF_CARS_SHOWROOM_URL=https://www.kingofcars.co.za/boksburg-used-cars
 */

import { createClient } from '@supabase/supabase-js'

const SOURCE_URL = process.env.KINGS_OF_CARS_SOURCE_URL ?? 'https://www.kingofcars.co.za/'
const SHOWROOM_URL = process.env.KINGS_OF_CARS_SHOWROOM_URL ?? 'https://www.kingofcars.co.za/boksburg-used-cars'
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const absolute = (href) => new URL(href, SOURCE_URL).toString()

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseJsonLd(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  const values = []
  for (const match of blocks) {
    try {
      const parsed = JSON.parse(match[1].trim())
      if (Array.isArray(parsed)) values.push(...parsed)
      else if (parsed?.['@graph']) values.push(...parsed['@graph'])
      else values.push(parsed)
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }
  return values
}

function meta(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i'))
  return clean(match?.[1]) || null
}

function links(html) {
  return [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)]
    .map((match) => {
      try { return absolute(match[1]) } catch { return null }
    })
    .filter((url) => url?.startsWith('https://www.kingofcars.co.za/'))
}

function candidateVehicleJsonLd(jsonLd) {
  return jsonLd.find((item) => {
    const type = item?.['@type']
    return type === 'Vehicle' || type === 'Car' || type === 'Product' || (Array.isArray(type) && type.some((v) => ['Vehicle', 'Car', 'Product'].includes(v)))
  })
}

function parseVehicle(url, html) {
  const jsonLd = parseJsonLd(html)
  const item = candidateVehicleJsonLd(jsonLd)
  const title = clean(item?.name || meta(html, 'og:title') || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1])
  if (!title) return null

  const priceRaw = item?.offers?.price ?? item?.offers?.lowPrice ?? item?.price
  const price = Number(String(priceRaw ?? '').replace(/[^0-9.]/g, '')) || null
  const year = Number(item?.vehicleModelDate || item?.modelDate || item?.productionDate || '') || null
  const mileageRaw = item?.mileageFromOdometer?.value ?? item?.mileage ?? item?.vehicleMileage
  const mileage = Number(String(mileageRaw ?? '').replace(/[^0-9]/g, '')) || null

  // JSON-LD varies between automotive platforms. Keep fields conservative and
  // let the admin/sync process enrich records when a source field is absent.
  const make = clean(item?.brand?.name || item?.manufacturer?.name || item?.make) || null
  const model = clean(item?.model || item?.vehicleModel) || null
  const variant = clean(item?.vehicleConfiguration || item?.trim || item?.variant) || null
  const transmission = clean(item?.vehicleTransmission || item?.transmission) || null
  const fuelType = clean(item?.fuelType) || null
  const colour = clean(item?.color || item?.colour) || null
  const bodyType = clean(item?.bodyType) || null
  const imageValues = Array.isArray(item?.image) ? item.image : item?.image ? [item.image] : []
  const images = imageValues.filter((v) => typeof v === 'string' && /^https?:\/\//i.test(v))
  const ogImage = meta(html, 'og:image')
  if (ogImage && !images.includes(ogImage)) images.unshift(ogImage)

  if (!make || !model) return null

  const displayName = [year || '', make, model, variant || ''].filter(Boolean).join(' ')
  const slug = slugify(displayName) || slugify(title)
  const stockNumber = clean(item?.sku || item?.mpn || item?.productID || item?.vehicleIdentificationNumber || '') || null

  return {
    stock_number: stockNumber,
    slug,
    make,
    model,
    variant,
    year,
    mileage,
    price,
    body_type: bodyType,
    transmission,
    fuel_type: fuelType,
    colour,
    description: clean(item?.description || meta(html, 'description')) || null,
    overview: clean(item?.description || '') || null,
    image_url: images[0] ?? null,
    gallery_urls: images,
    source_url: url,
    source_updated_at: new Date().toISOString(),
    status: 'available',
  }
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'KingsOfCarsInventorySync/1.0 (+public-inventory-sync)',
      accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`)
  return response.text()
}

async function main() {
  const showroomHtml = await fetchHtml(SHOWROOM_URL)
  const discovered = new Set([SHOWROOM_URL])

  // Follow same-site links from the showroom. The page may expose either
  // individual vehicle pages or a JS-driven catalogue; JSON-LD pages are kept.
  for (const url of links(showroomHtml)) {
    if (url === SOURCE_URL || url === SHOWROOM_URL) continue
    if (/contact|sell-your-car|finance|article|legal|privacy|terms|wishlist|login/i.test(url)) continue
    discovered.add(url.split('#')[0])
  }

  const vehicles = []
  for (const url of discovered) {
    try {
      const html = url === SHOWROOM_URL ? showroomHtml : await fetchHtml(url)
      const vehicle = parseVehicle(url, html)
      if (vehicle) vehicles.push(vehicle)
    } catch (error) {
      console.warn(`[skip] ${url}: ${error.message}`)
    }
  }

  const unique = [...new Map(vehicles.map((vehicle) => [vehicle.slug, vehicle])).values()]
  console.log(`Discovered ${unique.length} vehicle records from ${SOURCE_URL}`)

  if (!unique.length) {
    throw new Error('No vehicle records were discovered. The site may require browser rendering or its inventory markup may have changed.')
  }

  const { error } = await supabase
    .from('KingsOfCars_vehicles')
    .upsert(unique, { onConflict: 'slug' })

  if (error) throw error
  console.log(`Upserted ${unique.length} KingOfCars vehicle records.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
