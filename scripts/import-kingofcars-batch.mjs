#!/usr/bin/env node

import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const SHOWROOM_URL = process.env.KINGS_OF_CARS_SHOWROOM_URL ?? 'https://www.kingofcars.co.za/boksburg-used-cars'
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const MAX_PAGES = Number(process.env.KINGS_OF_CARS_MAX_PAGES ?? 40)
const BATCH_SIZE = Number(process.env.KINGS_OF_CARS_BATCH_SIZE ?? 20)
const BATCH_OFFSET = Number(process.env.KINGS_OF_CARS_BATCH_OFFSET ?? 0)
const CONCURRENCY = Number(process.env.KINGS_OF_CARS_DETAIL_CONCURRENCY ?? 3)

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('Missing Supabase credentials')
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim()
const slugify = (v) => clean(v).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const num = (v) => { const n = Number(String(v ?? '').replace(/[^0-9.]/g, '')); return Number.isFinite(n) && n > 0 ? n : null }
const int = (v) => { const n = Number(String(v ?? '').replace(/[^0-9]/g, '')); return Number.isFinite(n) && n > 0 ? Math.round(n) : null }

function parseJsonLd(blocks) {
  const out = []
  for (const raw of blocks) {
    try {
      const x = JSON.parse(raw)
      if (Array.isArray(x)) out.push(...x)
      else if (x?.['@graph']) out.push(...x['@graph'])
      else out.push(x)
    } catch {}
  }
  return out
}
function pickVehicle(items) {
  return items.find((x) => ['Vehicle', 'Car', 'Product'].includes(x?.['@type']) || Array.isArray(x?.['@type']) && x['@type'].some((t) => ['Vehicle', 'Car', 'Product'].includes(t))) ?? null
}
function textValue(text, re) { const m = text.match(re); return m?.[1] ? clean(m[1]) : null }

function makeVehicle({ url, title, description, text, jsonLdBlocks, images }) {
  const item = pickVehicle(parseJsonLd(jsonLdBlocks))
  const name = clean(item?.name || title)
  if (!name) return null
  const make = clean(item?.brand?.name || item?.manufacturer?.name || item?.make || textValue(text, /\bMake\s*[:\-]\s*([^|\n]+)/i)) || null
  const model = clean(item?.model || item?.vehicleModel || textValue(text, /\bModel\s*[:\-]\s*([^|\n]+)/i)) || null
  const variant = clean(item?.vehicleConfiguration || item?.trim || item?.variant || textValue(text, /\bVariant\s*[:\-]\s*([^|\n]+)/i)) || null
  const year = int(item?.vehicleModelDate || item?.modelDate || textValue(text, /\b(?:Year|Model Year)\s*[:\-]\s*(20\d{2})/i))
  const mileage = int(item?.mileageFromOdometer?.value ?? item?.mileage ?? textValue(text, /\bMileage\s*[:\-]?\s*([0-9,]+)/i))
  const price = num(item?.offers?.price ?? item?.offers?.lowPrice ?? item?.price ?? textValue(text, /\bPrice\s*[:\-]?\s*R?\s*([0-9,\.]+)/i))
  const transmission = clean(item?.vehicleTransmission || item?.transmission || textValue(text, /\bTransmission\s*[:\-]\s*([^|\n]+)/i)) || null
  const fuelType = clean(item?.fuelType || textValue(text, /\bFuel(?: Type)?\s*[:\-]\s*([^|\n]+)/i)) || null
  const colour = clean(item?.color || item?.colour || textValue(text, /\bColou?r\s*[:\-]\s*([^|\n]+)/i)) || null
  const bodyType = clean(item?.bodyType || textValue(text, /\bBody Type\s*[:\-]\s*([^|\n]+)/i)) || null
  const stockNumber = clean(item?.sku || item?.mpn || item?.productID || textValue(text, /\bStock(?: Number| No\.?| #)?\s*[:#\-]?\s*([A-Z0-9\-]+)/i)) || null
  const displayName = [year, make, model, variant].filter(Boolean).join(' ') || name
  const vehicleId = images.join('|').match(/\/Used\/(\d+)\//i)?.[1] || null
  const sourceKey = stockNumber || vehicleId || slugify(displayName)
  const slug = slugify(`${displayName}-${sourceKey}`)
  return { stock_number: stockNumber, slug, make: make || name.split(/\s+/)[0], model: model || name, variant, year, mileage, price, body_type: bodyType, transmission, fuel_type: fuelType, colour, description: clean(item?.description || description) || null, overview: clean(item?.description || description) || null, image_url: images[0] ?? null, gallery_urls: [...new Set(images)], source_url: url, source_updated_at: new Date().toISOString(), status: 'available' }
}

async function discoverUrls(page) {
  const urls = new Set()
  for (let p = 1; p <= MAX_PAGES; p++) {
    await page.waitForTimeout(1200)
    const found = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href))
    for (const href of found) if (/^https:\/\/www\.kingofcars\.co\.za\/result\//i.test(href)) urls.add(href.split('#')[0])
    const clicked = await page.evaluate(() => {
      const els = [...document.querySelectorAll('a,button')]
      const next = els.find(e => { const t = (e.textContent || '').trim().toLowerCase(); const a = (e.getAttribute('aria-label') || '').toLowerCase(); const c = String(e.className || '').toLowerCase(); return !e.disabled && !e.classList.contains('disabled') && (t === 'next' || t === '›' || t === '»' || a.includes('next') || c.includes('next')) })
      if (!next) return false
      next.click(); return true
    })
    if (!clicked) break
    await page.waitForTimeout(1600)
  }
  return [...urls]
}

async function scrape(browser, url) {
  const page = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(800)
    const d = await page.evaluate(() => {
      const html = document.documentElement.outerHTML
      const text = document.body?.innerText || ''
      const images = [...new Set([
        ...[...document.images].flatMap(i => [i.currentSrc, i.src, i.dataset.src, i.dataset.lazySrc]).filter(Boolean),
        ...[...html.matchAll(/https?:\/\/image\.blob\.ix\.co\.za\/Used\/[^"'\\s<>]+/gi)].map(m => m[0].replace(/&amp;/g, '&'))
      ])]
      return { text, title: document.querySelector('h1')?.textContent?.trim() || document.title, description: document.querySelector('meta[name="description"]')?.content || '', jsonLdBlocks: [...document.querySelectorAll('script[type="application/ld+json"]')].map(x => x.textContent || ''), images }
    })
    return makeVehicle({ url, ...d, images: d.images.filter(x => /image\.blob\.ix\.co\.za\/Used\//i.test(x)) })
  } finally { await page.close() }
}

async function upsertBatch(vehicles) {
  const unique = [...new Map(vehicles.map(v => [v.slug, v])).values()]
  if (!unique.length) return 0
  const { data, error } = await supabase.from('KingsOfCars_vehicles').upsert(unique, { onConflict: 'slug' }).select('id,slug')
  if (error) throw error
  const idBySlug = new Map((data || []).map(r => [r.slug, r.id]))
  for (const v of unique) {
    const id = idBySlug.get(v.slug)
    if (!id) continue
    const { error: delError } = await supabase.from('KingsOfCars_vehicle_images').delete().eq('vehicle_id', id)
    if (delError) throw delError
    if (v.gallery_urls.length) {
      const rows = v.gallery_urls.map((image_url, sort_order) => ({ vehicle_id: id, image_url, sort_order, is_primary: sort_order === 0, alt_text: v.slug }))
      const { error: imgError } = await supabase.from('KingsOfCars_vehicle_images').insert(rows)
      if (imgError) throw imgError
    }
  }
  return unique.length
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(SHOWROOM_URL, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.waitForTimeout(2500)
    const urls = await discoverUrls(page)
    await page.close()
    console.log(`Discovered ${urls.length} vehicles. Batch offset=${BATCH_OFFSET}, size=${BATCH_SIZE}`)
    const batchUrls = urls.slice(BATCH_OFFSET, BATCH_OFFSET + BATCH_SIZE)
    if (!batchUrls.length) { console.log('No vehicles in this batch.'); return }
    const vehicles = []
    for (let i = 0; i < batchUrls.length; i += CONCURRENCY) {
      const chunk = batchUrls.slice(i, i + CONCURRENCY)
      const result = await Promise.all(chunk.map(u => scrape(browser, u).catch(e => { console.warn(`[skip] ${u}: ${e.message}`); return null })))
      vehicles.push(...result.filter(Boolean))
      console.log(`Scraped ${Math.min(i + chunk.length, batchUrls.length)}/${batchUrls.length}`)
    }
    const count = await upsertBatch(vehicles)
    console.log(`Imported batch ${BATCH_OFFSET}-${BATCH_OFFSET + batchUrls.length - 1}: ${count} vehicles`)
  } finally { await browser.close() }
}
main().catch(e => { console.error(e); process.exit(1) })
