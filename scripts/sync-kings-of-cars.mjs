#!/usr/bin/env node

/**
 * Browser-backed King of Cars inventory sync.
 *
 * The Boksburg inventory is rendered by the public site's JavaScript widgets,
 * so plain fetch/HTML parsing misses the vehicle cards. Playwright renders the
 * showroom, follows pagination, discovers every public result URL, then opens
 * each vehicle page and extracts the real ix.co.za gallery URLs.
 *
 * Required env:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 *   KINGS_OF_CARS_SHOWROOM_URL
 *   KINGS_OF_CARS_MAX_PAGES (default 40)
 *   KINGS_OF_CARS_DETAIL_CONCURRENCY (default 4)
 */

import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const SHOWROOM_URL = process.env.KINGS_OF_CARS_SHOWROOM_URL ?? 'https://www.kingofcars.co.za/boksburg-used-cars'
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const MAX_PAGES = Number(process.env.KINGS_OF_CARS_MAX_PAGES ?? 40)
const DETAIL_CONCURRENCY = Number(process.env.KINGS_OF_CARS_DETAIL_CONCURRENCY ?? 4)

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const absolute = (href, base) => {
  try { return new URL(href, base).toString() } catch { return null }
}
const slugify = (value) => clean(value)
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

function parseJsonLd(blocks) {
  const values = []
  for (const raw of blocks) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) values.push(...parsed)
      else if (parsed?.['@graph']) values.push(...parsed['@graph'])
      else values.push(parsed)
    } catch {
      // Some pages contain malformed/empty JSON-LD blocks.
    }
  }
  return values
}

function vehicleJsonLd(items) {
  return items.find((item) => {
    const type = item?.['@type']
    return type === 'Vehicle' || type === 'Car' || type === 'Product' ||
      (Array.isArray(type) && type.some((value) => ['Vehicle', 'Car', 'Product'].includes(value)))
  }) ?? null
}

function numberValue(value) {
  const number = Number(String(value ?? '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(number) && number > 0 ? number : null
}

function integerValue(value) {
  const number = Number(String(value ?? '').replace(/[^0-9]/g, ''))
  return Number.isFinite(number) && number > 0 ? Math.round(number) : null
}

function fromText(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return clean(match[1])
  }
  return null
}

function buildVehicle({ url, title, description, jsonLdBlocks, images, text }) {
  const item = vehicleJsonLd(parseJsonLd(jsonLdBlocks))
  const name = clean(item?.name || title)
  if (!name) return null

  const make = clean(item?.brand?.name || item?.manufacturer?.name || item?.make ||
    fromText(text, [/\bMake\s*[:\-]\s*([^|\n]+)/i])) || null
  const model = clean(item?.model || item?.vehicleModel ||
    fromText(text, [/\bModel\s*[:\-]\s*([^|\n]+)/i])) || null
  const variant = clean(item?.vehicleConfiguration || item?.trim || item?.variant ||
    fromText(text, [/\bVariant\s*[:\-]\s*([^|\n]+)/i])) || null
  const year = integerValue(item?.vehicleModelDate || item?.modelDate || item?.productionDate ||
    fromText(text, [/\b(?:Year|Model Year)\s*[:\-]\s*(20\d{2})/i]))
  const mileage = integerValue(item?.mileageFromOdometer?.value ?? item?.mileage ??
    fromText(text, [/\bMileage\s*[:\-]?\s*([0-9,]+)/i]))
  const price = numberValue(item?.offers?.price ?? item?.offers?.lowPrice ?? item?.price ??
    fromText(text, [/\b(?:Price|R)\s*[:\-]?\s*R?\s*([0-9,\.]+)/i]))
  const transmission = clean(item?.vehicleTransmission || item?.transmission ||
    fromText(text, [/\bTransmission\s*[:\-]\s*([^|\n]+)/i])) || null
  const fuelType = clean(item?.fuelType ||
    fromText(text, [/\bFuel(?: Type)?\s*[:\-]\s*([^|\n]+)/i])) || null
  const colour = clean(item?.color || item?.colour ||
    fromText(text, [/\bColou?r\s*[:\-]\s*([^|\n]+)/i])) || null
  const bodyType = clean(item?.bodyType ||
    fromText(text, [/\bBody Type\s*[:\-]\s*([^|\n]+)/i])) || null
  const stockNumber = clean(item?.sku || item?.mpn || item?.productID ||
    fromText(text, [/\bStock(?: Number| No\.?| #)?\s*[:#\-]?\s*([A-Z0-9\-]+)/i])) || null

  const displayName = [year, make, model, variant].filter(Boolean).join(' ') || name
  const vehicleId = images.join('|').match(/\/Used\/(\d+)\//)?.[1] || url.match(/\/(\d+)_/)?.[1] || null
  const sourceKey = stockNumber || vehicleId || slugify(displayName)
  const slug = slugify(`${displayName}-${sourceKey}`)

  return {
    stock_number: stockNumber,
    slug,
    make: make || name.split(/\s+/)[0],
    model: model || name,
    variant,
    year,
    mileage,
    price,
    body_type: bodyType,
    transmission,
    fuel_type: fuelType,
    colour,
    description: clean(item?.description || description) || null,
    overview: clean(item?.description || description) || null,
    image_url: images[0] ?? null,
    gallery_urls: [...new Set(images)],
    source_url: url,
    source_updated_at: new Date().toISOString(),
    status: 'available',
  }
}

async function collectVehicleUrls(page) {
  const urls = new Set()
  let lastSignature = ''

  for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber += 1) {
    await page.waitForTimeout(1000)
    const anchors = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href))
    for (const href of anchors) {
      if (/^https:\/\/www\.kingofcars\.co\.za\/result\//i.test(href)) urls.add(href.split('#')[0])
    }

    const signature = [...urls].sort().join('|')
    if (signature === lastSignature) break
    lastSignature = signature

    const nextClicked = await page.evaluate(() => {
      const elements = [...document.querySelectorAll('a,button')]
      const candidates = elements.filter((element) => {
        const text = (element.textContent || '').trim().toLowerCase()
        const aria = (element.getAttribute('aria-label') || '').toLowerCase()
        const className = (element.className || '').toString().toLowerCase()
        return /^(next|›|»)$/.test(text) || aria.includes('next') || className.includes('next')
      })
      const next = candidates.find((element) =>
        !element.hasAttribute('disabled') &&
        !element.classList.contains('disabled') &&
        element.getAttribute('aria-disabled') !== 'true'
      )
      if (!next) return false
      next.scrollIntoView({ block: 'center' })
      next.click()
      return true
    })

    if (!nextClicked) break
    await page.waitForTimeout(1800)
  }

  return [...urls]
}

async function scrapeVehicle(browser, url) {
  const page = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(900)

    const data = await page.evaluate(() => {
      const text = document.body?.innerText || ''
      const title = document.querySelector('h1')?.textContent?.trim() || document.title || ''
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const jsonLdBlocks = [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent || '')
      const html = document.documentElement.outerHTML
      const rawImages = [...document.images]
        .flatMap((img) => [img.currentSrc, img.src, img.getAttribute('data-src'), img.getAttribute('data-lazy-src')])
        .filter(Boolean)
      const cdnImages = [...html.matchAll(/https?:\/\/image\.blob\.ix\.co\.za\/Used\/[^"'\\s<>]+/gi)]
        .map((match) => match[0].replace(/&amp;/g, '&'))
      return { text, title, description, jsonLdBlocks, images: [...new Set([...rawImages, ...cdnImages])] }
    })

    const images = data.images
      .map((value) => absolute(value, url))
      .filter((value) => value && /image\.blob\.ix\.co\.za\/Used\//i.test(value))

    return buildVehicle({ url, ...data, images })
  } finally {
    await page.close()
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  try {
    const showroom = await browser.newPage()
    await showroom.goto(SHOWROOM_URL, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await showroom.waitForTimeout(2500)

    const urls = await collectVehicleUrls(showroom)
    await showroom.close()

    console.log(`Discovered ${urls.length} vehicle URLs from ${SHOWROOM_URL}`)
    if (!urls.length) throw new Error('No vehicle result URLs found after browser rendering.')

    const vehicles = []
    for (let index = 0; index < urls.length; index += DETAIL_CONCURRENCY) {
      const batch = urls.slice(index, index + DETAIL_CONCURRENCY)
      const results = await Promise.all(batch.map((url) => scrapeVehicle(browser, url).catch((error) => {
        console.warn(`[skip] ${url}: ${error.message}`)
        return null
      })))
      vehicles.push(...results.filter(Boolean))
      console.log(`Scraped ${Math.min(index + batch.length, urls.length)}/${urls.length}`)
    }

    const unique = [...new Map(vehicles.map((vehicle) => [vehicle.slug, vehicle])).values()]
    if (!unique.length) throw new Error('No vehicle records could be parsed.')

    const { data: upserted, error } = await supabase
      .from('KingsOfCars_vehicles')
      .upsert(unique, { onConflict: 'slug' })
      .select('id,slug')

    if (error) throw error

    const idBySlug = new Map((upserted || []).map((row) => [row.slug, row.id]))

    for (const vehicle of unique) {
      const vehicleId = idBySlug.get(vehicle.slug)
      if (!vehicleId) continue

      const { error: deleteError } = await supabase
        .from('KingsOfCars_vehicle_images')
        .delete()
        .eq('vehicle_id', vehicleId)
      if (deleteError) throw deleteError

      if (vehicle.gallery_urls?.length) {
        const rows = vehicle.gallery_urls.map((image_url, sort_order) => ({
          vehicle_id: vehicleId,
          image_url,
          sort_order,
          is_primary: sort_order === 0,
          alt_text: vehicle.slug,
        }))
        const { error: imageError } = await supabase
          .from('KingsOfCars_vehicle_images')
          .insert(rows)
        if (imageError) throw imageError
      }
    }

    console.log(`Upserted ${unique.length} King of Cars vehicles and their image galleries.`)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
