#!/usr/bin/env node

/** Full King of Cars inventory sync. Prices are intentionally stored as NULL/POA. */

import chromiumBinary from '@sparticuz/chromium'
import { chromium as playwrightChromium } from 'playwright'
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
const absolute = (href, base) => { try { return new URL(href, base).toString() } catch { return null } }
const slugify = (value) => clean(value).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function parseJsonLd(blocks) {
  const values = []
  for (const raw of blocks) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) values.push(...parsed)
      else if (parsed?.['@graph']) values.push(...parsed['@graph'])
      else values.push(parsed)
    } catch {}
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

function stockFromUrl(url) {
  const matches = [...String(url).matchAll(/(?:result|Used)[^\d]*(\d{6,})/gi)]
  return matches.at(-1)?.[1] ?? null
}

function nameFromImage(images) {
  const first = images.find((value) => /image\.blob\.ix\.co\.za\/Used\//i.test(value))
  if (!first) return null
  try {
    const path = decodeURIComponent(new URL(first).pathname)
    const file = path.split('/').pop() ?? ''
    const withoutExt = file.replace(/\.(?:jpe?g|png|webp)$/i, '')
    const parts = withoutExt.split('-')
    // King of Cars image names are: YEAR-COLOUR-MAKE-MODEL-VARIANT-STOCK-N
    const stockIndex = parts.findIndex((part) => /^\d{6,}$/.test(part))
    if (stockIndex < 0) return null
    const prefix = parts.slice(0, stockIndex)
    const yearIndex = prefix.findIndex((part) => /^20\d{2}$/.test(part))
    if (yearIndex < 0) return null
    const year = prefix[yearIndex]
    const rest = prefix.slice(yearIndex + 1)
    // Drop the colour token and common category token; retain the descriptive vehicle name.
    const knownCategories = new Set(['Light', 'Commercial', 'Passenger', 'Vehicle'])
    const tokens = rest.filter((token, index) => index !== 0 && !knownCategories.has(token))
    return clean(`${year} ${tokens.join(' ')}`)
  } catch {
    return null
  }
}

function buildVehicle({ url, title, description, jsonLdBlocks, images, text, metaTitle, ogTitle }) {
  const item = vehicleJsonLd(parseJsonLd(jsonLdBlocks))
  const stockFromImages = images.join('|').match(/\/Used\/(\d+)\//i)?.[1] ?? null
  const stockNumber = clean(item?.sku || item?.mpn || item?.productID || fromText(text, [
    /\bStock(?: Number| No\.?| #)?\s*[:#\-]?\s*([A-Z0-9\-]+)/i,
  ]) || stockFromImages || stockFromUrl(url)) || null

  const fallbackName = nameFromImage(images) || clean(ogTitle || metaTitle || title || fromText(text, [
    /(?:Vehicle|Car)\s*[:\-]\s*([^\n]+)/i,
  ]))
  const name = clean(item?.name || fallbackName)
  if (!name && !stockNumber) return null

  const make = clean(item?.brand?.name || item?.manufacturer?.name || item?.make || fromText(text, [
    /\bMake\s*[:\-]\s*([^|\n]+)/i,
  ])) || null
  const model = clean(item?.model || item?.vehicleModel || fromText(text, [
    /\bModel\s*[:\-]\s*([^|\n]+)/i,
  ])) || null
  const variant = clean(item?.vehicleConfiguration || item?.trim || item?.variant || fromText(text, [
    /\bVariant\s*[:\-]\s*([^|\n]+)/i,
  ])) || null
  const year = integerValue(item?.vehicleModelDate || item?.modelDate || item?.productionDate || fromText(text, [
    /\b(?:Year|Model Year)\s*[:\-]\s*(20\d{2})/i,
  ]) || name.match(/\b(20\d{2})\b/)?.[1])
  const mileage = integerValue(item?.mileageFromOdometer?.value ?? item?.mileage ?? fromText(text, [
    /\bMileage\s*[:\-]?\s*([0-9,]+)/i,
  ]))
  const transmission = clean(item?.vehicleTransmission || item?.transmission || fromText(text, [
    /\bTransmission\s*[:\-]\s*([^|\n]+)/i,
  ])) || null
  const fuelType = clean(item?.fuelType || fromText(text, [
    /\bFuel(?: Type)?\s*[:\-]\s*([^|\n]+)/i,
  ])) || null
  const colour = clean(item?.color || item?.colour || fromText(text, [
    /\bColou?r\s*[:\-]\s*([^|\n]+)/i,
  ])) || null
  const bodyType = clean(item?.bodyType || fromText(text, [
    /\bBody Type\s*[:\-]\s*([^|\n]+)/i,
  ])) || null

  const displayName = [year, make, model, variant].filter(Boolean).join(' ') || name || `King of Cars vehicle ${stockNumber}`
  const sourceKey = stockNumber || stockFromImages || slugify(displayName)
  const slug = slugify(`${displayName}-${sourceKey}`)

  return {
    stock_number: stockNumber,
    slug,
    make: make || name?.split(/\s+/)[1] || name?.split(/\s+/)[0] || 'Unknown',
    model: model || name || `Vehicle ${stockNumber}`,
    variant,
    year,
    mileage,
    price: null,
    body_type: bodyType,
    transmission,
    fuel_type: fuelType,
    colour,
    description: clean(item?.description || description) || name || null,
    overview: clean(item?.description || description) || name || null,
    image_url: images[0] ?? null,
    gallery_urls: [...new Set(images)],
    source_url: url,
    source_updated_at: new Date().toISOString(),
    status: 'available',
  }
}

async function collectVehicleUrls(page) {
  const urls = new Set()
  let previousSignature = ''

  for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber += 1) {
    await page.waitForTimeout(1200)
    const anchors = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href))
    for (const href of anchors) {
      if (/\/result\//i.test(href) && /kingofcars\.co\.za/i.test(href)) urls.add(href.split('#')[0])
    }

    const signature = [...urls].sort().join('|')
    console.log(`Showroom page ${pageNumber}: ${urls.size} vehicles discovered`)
    if (signature === previousSignature) break
    previousSignature = signature

    const clicked = await page.evaluate(() => {
      const candidates = [...document.querySelectorAll('a,button')].filter((element) => {
        const text = (element.textContent || '').trim().toLowerCase()
        const aria = (element.getAttribute('aria-label') || '').toLowerCase()
        const className = (element.className || '').toString().toLowerCase()
        return /^(next|›|»)$/.test(text) || aria.includes('next') || className.includes('next')
      })
      const next = candidates.find((element) => !element.hasAttribute('disabled') && !element.classList.contains('disabled') && element.getAttribute('aria-disabled') !== 'true')
      if (!next) return false
      next.scrollIntoView({ block: 'center' })
      next.click()
      return true
    })
    if (!clicked) break
    await page.waitForTimeout(2200)
  }

  return [...urls]
}

async function scrapeVehicle(browser, url) {
  const page = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(1200)

    const data = await page.evaluate(() => {
      const text = document.body?.innerText || ''
      const title = document.querySelector('h1')?.textContent?.trim() || document.title || ''
      const metaTitle = document.querySelector('meta[name="title"]')?.getAttribute('content') || ''
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || ''
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const jsonLdBlocks = [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent || '')
      const html = document.documentElement.outerHTML
      const rawImages = [...document.images].flatMap((img) => [
        img.currentSrc,
        img.src,
        img.getAttribute('data-src'),
        img.getAttribute('data-lazy-src'),
        img.getAttribute('data-original'),
      ]).filter(Boolean)
      const srcsetImages = [...document.querySelectorAll('[srcset]')].flatMap((node) => (node.getAttribute('srcset') || '').split(',').map((part) => part.trim().split(/\s+/)[0])).filter(Boolean)
      const cdnImages = [...html.matchAll(/https?:\/\/image\.blob\.ix\.co\.za\/Used\/[^"'\\s<>]+/gi)].map((match) => match[0].replace(/&amp;/g, '&'))
      return { text, title, metaTitle, ogTitle, description, jsonLdBlocks, images: [...new Set([...rawImages, ...srcsetImages, ...cdnImages])] }
    })

    const images = data.images.map((value) => absolute(value, url)).filter((value) => value && /image\.blob\.ix\.co\.za\/Used\//i.test(value))
    const vehicle = buildVehicle({ url, ...data, images })
    if (!vehicle) console.warn(`[unparsed] ${url} | title=${data.title} | stock=${stockFromUrl(url)}`)
    return vehicle
  } finally {
    await page.close()
  }
}

async function main() {
  chromiumBinary.setGraphicsMode = false
  const executablePath = await chromiumBinary.executablePath()
  console.log(`Using serverless Chromium: ${executablePath}`)
  console.log(`Syncing full inventory from ${SHOWROOM_URL}`)

  const browser = await playwrightChromium.launch({ headless: true, executablePath, args: chromiumBinary.args })

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
    console.log(`Parsed ${unique.length}/${urls.length} vehicle records.`)
    if (!unique.length) throw new Error('No vehicle records could be parsed.')

    const { data: upserted, error } = await supabase.from('KingsOfCars_vehicles').upsert(unique, { onConflict: 'slug' }).select('id,slug')
    if (error) throw error

    const idBySlug = new Map((upserted || []).map((row) => [row.slug, row.id]))
    for (const vehicle of unique) {
      const vehicleId = idBySlug.get(vehicle.slug)
      if (!vehicleId) continue

      const { error: deleteError } = await supabase.from('KingsOfCars_vehicle_images').delete().eq('vehicle_id', vehicleId)
      if (deleteError) throw deleteError

      if (vehicle.gallery_urls?.length) {
        const rows = vehicle.gallery_urls.map((image_url, sort_order) => ({
          vehicle_id: vehicleId,
          image_url,
          sort_order,
          is_primary: sort_order === 0,
          alt_text: [vehicle.year, vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(' '),
        }))
        const { error: imageError } = await supabase.from('KingsOfCars_vehicle_images').insert(rows)
        if (imageError) throw imageError
      }
    }

    console.log(`SUCCESS: Upserted ${unique.length} King of Cars vehicles.`)
    console.log('SUCCESS: Rebuilt image galleries for every imported vehicle.')
    console.log('SUCCESS: All imported vehicle prices are POA (price = NULL).')
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
