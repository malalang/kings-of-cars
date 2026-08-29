#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CONCURRENCY = Math.max(Number(process.env.KINGS_OF_CARS_LIVE_CONCURRENCY ?? 4), 1)
const MIN_ROWS = Math.max(Number(process.env.KINGS_OF_CARS_MIN_SYNC_ROWS ?? 50), 1)

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const clean = (value) => String(value ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
const numberValue = (value) => {
  if (value == null || value === '') return null
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

function sourceStockFromImage(imageUrl) {
  const match = String(imageUrl ?? '').match(/\/Used\/(\d+)\//i)
  return match?.[1] ?? null
}

function resultUrl(row) {
  if (row.source_url) return row.source_url
  const stock = sourceStockFromImage(row.image_url)
  return stock ? `https://www.kingofcars.co.za/result/VehicleStockSearch-BarTile/${stock}_Lead_Inline__PCM_PCP_SVV` : null
}

function linesFromText(text) {
  return String(text ?? '')
    .split(/\r?\n/)
    .map(clean)
    .filter(Boolean)
}

function firstMatch(text, regex) {
  const match = String(text ?? '').match(regex)
  return match?.[1] ? clean(match[1]) : null
}

function parseLivePage(text, fallback) {
  const lines = linesFromText(text)
  const mileageIndex = lines.findIndex((line) => /^\d[\d\s,]*\s*km$/i.test(line))
  const mileage = mileageIndex >= 0 ? numberValue(lines[mileageIndex]) : null
  const colour = mileageIndex >= 0 ? lines[mileageIndex + 1] ?? null : null
  const boksburgIndex = lines.findIndex((line, index) => index > mileageIndex && /Boksburg/i.test(line))
  const bodyType = boksburgIndex >= 0 ? lines[boksburgIndex + 1] ?? null : null
  const transmission = boksburgIndex >= 0 ? lines[boksburgIndex + 2] ?? null : null
  const fuelType = boksburgIndex >= 0 ? lines[boksburgIndex + 3] ?? null : null
  const yearIndex = lines.findIndex((line) => /^20\d{2}$/.test(line))
  const title = yearIndex >= 0 ? lines[yearIndex + 1] ?? null : null
  const price = firstMatch(text, /Price\s*:\s*R\s*([0-9\s,]+)/i)
  const monthlyPayment = firstMatch(text, /R\s*([0-9\s,]+)\s*pm/i)
  const powerKw = firstMatch(text, /([0-9]+)\s*kW\b/i)
  const torqueNm = firstMatch(text, /([0-9]+)\s*Nm\b/i)
  const engineCc = firstMatch(text, /Engine\s*CC\s*([0-9]+)/i)
  const sourceReference = firstMatch(text, /Listing\s*ref\s+([A-Z0-9-]+)/i)

  return {
    title,
    year: yearIndex >= 0 ? numberValue(lines[yearIndex]) : fallback.year,
    mileage,
    price: numberValue(price),
    monthly_payment: numberValue(monthlyPayment),
    colour,
    body_type: bodyType,
    transmission,
    fuel_type: fuelType,
    power_kw: numberValue(powerKw),
    engine_size: engineCc ? `${engineCc} cc` : null,
    source_reference: sourceReference,
  }
}

function splitTitle(title, fallback) {
  if (!title) return fallback
  const value = clean(title)
  const match = value.match(/^(?:20\d{2}\s+)?(.+?)\s+(.+)$/)
  if (!match) return fallback
  const knownMakes = [
    'Toyota', 'Volkswagen', 'Hyundai', 'Ford', 'Nissan', 'Kia', 'Suzuki', 'Renault', 'BMW',
    'Mercedes-Benz', 'Mercedes', 'Audi', 'Lexus', 'Land Rover', 'Jaguar', 'Isuzu', 'Mahindra',
    'Chery', 'Haval', 'GWM', 'LDV', 'Jetour', 'Volvo', 'Honda', 'Mazda', 'Mitsubishi', 'Subaru',
    'Peugeot', 'Citroen', 'Opel', 'Fiat', 'Jeep', 'Porsche', 'Mini', 'Volvo', 'Alfa Romeo',
  ]
  const make = knownMakes.find((candidate) => value.startsWith(`${candidate} `))
  if (!make) return fallback
  const remainder = value.slice(make.length).trim()
  const modelWords = remainder.split(/\s+/)
  const model = modelWords.slice(0, Math.min(3, modelWords.length)).join(' ')
  const variant = modelWords.slice(model.split(/\s+/).length).join(' ') || null
  return { ...fallback, make, model, variant }
}

async function enrichRow(browser, row) {
  const url = resultUrl(row)
  if (!url) return { row, ok: false, reason: 'no source URL' }
  const page = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(500)
    const text = await page.locator('body').innerText()
    const parsed = parseLivePage(text, row)
    const identity = splitTitle(parsed.title, { make: row.make, model: row.model, variant: row.variant })
    const patch = {
      source_url: url,
      source_updated_at: new Date().toISOString(),
      year: parsed.year ?? row.year,
      mileage: parsed.mileage ?? row.mileage,
      price: parsed.price ?? row.price,
      monthly_payment: parsed.monthly_payment ?? row.monthly_payment,
      colour: parsed.colour || row.colour,
      body_type: parsed.body_type || row.body_type,
      transmission: parsed.transmission || row.transmission,
      fuel_type: parsed.fuel_type || row.fuel_type,
      power_kw: parsed.power_kw ?? row.power_kw,
      engine_size: parsed.engine_size || row.engine_size,
      make: identity.make || row.make,
      model: identity.model || row.model,
      variant: identity.variant || row.variant,
      vehicle_name: parsed.title || row.vehicle_name,
    }
    return { row, patch, ok: true, url }
  } catch (error) {
    return { row, ok: false, url, reason: error instanceof Error ? error.message : String(error) }
  } finally {
    await page.close()
  }
}

async function main() {
  const { data: rows, error } = await supabase
    .from('KingsOfCars_vehicles')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: true })

  if (error) throw error
  if (!rows?.length || rows.length < MIN_ROWS) throw new Error(`Only ${rows?.length ?? 0} available rows found; refusing live enrichment.`)

  const browser = await chromium.launch({ headless: true })
  let cursor = 0
  let success = 0
  let failed = 0
  try {
    async function worker() {
      while (true) {
        const index = cursor++
        if (index >= rows.length) return
        const result = await enrichRow(browser, rows[index])
        if (!result.ok) {
          failed += 1
          console.warn(`LIVE FAIL ${index + 1}/${rows.length} ${rows[index].id}: ${result.reason}`)
          continue
        }
        const { error: updateError } = await supabase
          .from('KingsOfCars_vehicles')
          .update(result.patch)
          .eq('id', rows[index].id)
        if (updateError) throw updateError
        success += 1
        console.log(`LIVE OK ${success + failed}/${rows.length}: ${result.patch.vehicle_name ?? rows[index].id}`)
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, rows.length) }, worker))
  } finally {
    await browser.close()
  }

  const { data: verification, error: verifyError } = await supabase
    .from('KingsOfCars_vehicles')
    .select('id,make,model,variant,year,mileage,price,monthly_payment,body_type,transmission,fuel_type,colour,source_url')
    .eq('status', 'available')
  if (verifyError) throw verifyError

  const stillMissing = (verification ?? []).filter((row) => !row.transmission || !row.fuel_type || !row.body_type || !row.source_url).length
  console.log(`LIVE ENRICHMENT COMPLETE: success=${success}; failed=${failed}; available=${verification?.length ?? 0}; stillMissingCoreFields=${stillMissing}`)
  if (stillMissing > 0) console.warn('Some records still need manual/source-specific review; no guessed values were written.')
}

main().catch((error) => {
  console.error('LIVE SYNC FAILED:', error)
  process.exit(1)
})
