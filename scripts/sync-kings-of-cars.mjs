#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { DEALER_ID, PAGE_SIZE, API_URL, fetchInventory, mapVehicle } from './lib/kingofcars-engine-api.mjs'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const MIN_EXPECTED = Number(process.env.KINGS_OF_CARS_MIN_EXPECTED ?? 250)
const MAX_EXPECTED = Number(process.env.KINGS_OF_CARS_MAX_EXPECTED ?? 1000)
const UPSERT_BATCH_SIZE = Number(process.env.KINGS_OF_CARS_UPSERT_BATCH_SIZE ?? 50)

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function upsertBatch(rows) {
  const { data, error } = await supabase
    .from('KingsOfCars_vehicles')
    .upsert(rows, { onConflict: 'slug' })
    .select('id,slug,stock_number,source_url')
  if (error) throw error
  return data ?? []
}

async function rebuildImages(rowsBySlug) {
  const ids = rowsBySlug.map((row) => row.id).filter(Boolean)
  if (!ids.length) return

  const { error: deleteError } = await supabase
    .from('KingsOfCars_vehicle_images')
    .delete()
    .in('vehicle_id', ids)
  if (deleteError) throw deleteError

  const imageRows = []
  for (const vehicle of rowsBySlug) {
    const gallery = Array.isArray(vehicle.gallery_urls) ? vehicle.gallery_urls : []
    for (const [sortOrder, imageUrl] of gallery.entries()) {
      imageRows.push({
        vehicle_id: vehicle.id,
        image_url: imageUrl,
        sort_order: sortOrder,
        is_primary: sortOrder === 0,
        alt_text: [vehicle.year, vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(' '),
      })
    }
  }

  for (let index = 0; index < imageRows.length; index += 500) {
    const batch = imageRows.slice(index, index + 500)
    const { error } = await supabase.from('KingsOfCars_vehicle_images').insert(batch)
    if (error) throw error
  }
}

async function removeStaleKingOfCarsRows(activeVehicles) {
  const activeSlugs = new Set(activeVehicles.map((vehicle) => vehicle.slug))
  const { data: existing, error } = await supabase
    .from('KingsOfCars_vehicles')
    .select('id,slug,source_url')
    .ilike('source_url', '%kingofcars.co.za%')
  if (error) throw error

  const staleIds = (existing ?? []).filter((row) => !activeSlugs.has(row.slug)).map((row) => row.id)
  if (!staleIds.length) return 0

  const { error: imageError } = await supabase
    .from('KingsOfCars_vehicle_images')
    .delete()
    .in('vehicle_id', staleIds)
  if (imageError) throw imageError

  const { error: vehicleError } = await supabase
    .from('KingsOfCars_vehicles')
    .delete()
    .in('id', staleIds)
  if (vehicleError) throw vehicleError

  return staleIds.length
}

async function main() {
  console.log(`King of Cars Engine API: ${API_URL}`)
  console.log(`Dealer: ${DEALER_ID}; pageSize: ${PAGE_SIZE}`)

  const { rows: sourceRows, finalCount, payload } = await fetchInventory()
  console.log(`Engine API returned ${sourceRows.length} vehicles; finalCount=${finalCount}`)
  console.log(`Request payload: ${JSON.stringify(payload)}`)

  if (!finalCount || finalCount < MIN_EXPECTED || finalCount > MAX_EXPECTED) {
    throw new Error(`Unexpected source inventory count ${finalCount}; expected ${MIN_EXPECTED}-${MAX_EXPECTED}. Refusing to modify production inventory.`)
  }

  const vehicles = sourceRows.map(mapVehicle).filter((vehicle) => vehicle.slug && vehicle.model)
  const unique = [...new Map(vehicles.map((vehicle) => [vehicle.slug, vehicle])).values()]
  console.log(`Mapped ${unique.length} unique vehicles.`)

  if (unique.length < Math.min(MIN_EXPECTED, Math.floor(finalCount * 0.9)) || unique.length > MAX_EXPECTED) {
    throw new Error(`Mapped ${unique.length} vehicles from expected source count ${finalCount}. Refusing to modify production inventory.`)
  }

  const importedRows = []
  for (let index = 0; index < unique.length; index += UPSERT_BATCH_SIZE) {
    const batch = unique.slice(index, index + UPSERT_BATCH_SIZE)
    const result = await upsertBatch(batch)
    importedRows.push(...result)
    console.log(`Upserted ${Math.min(index + batch.length, unique.length)}/${unique.length}`)
  }

  const importedBySlug = new Map(importedRows.map((row) => [row.slug, row.id]))
  const galleryRows = unique.map((vehicle) => ({
    ...vehicle,
    id: importedBySlug.get(vehicle.slug),
  })).filter((vehicle) => vehicle.id)

  await rebuildImages(galleryRows)
  console.log(`Rebuilt galleries for ${galleryRows.length} vehicles.`)

  const staleCount = await removeStaleKingOfCarsRows(unique)
  console.log(`Removed ${staleCount} stale King of Cars rows.`)

  const { count: finalTableCount, error: countError } = await supabase
    .from('KingsOfCars_vehicles')
    .select('id', { count: 'exact', head: true })
  if (countError) throw countError

  const { count: availableCount, error: availableError } = await supabase
    .from('KingsOfCars_vehicles')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'available')
  if (availableError) throw availableError

  console.log(`VERIFIED: table rows=${finalTableCount}; available=${availableCount}; source=${finalCount}`)
  if ((availableCount ?? 0) < Math.min(MIN_EXPECTED, Math.floor(finalCount * 0.9))) {
    throw new Error(`Verification failed: only ${availableCount} available vehicles after sync.`)
  }

  console.log('SUCCESS: Full King of Cars inventory sync completed.')
}

main().catch((error) => {
  console.error('SYNC FAILED:', error)
  process.exit(1)
})
