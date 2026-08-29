#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { fetchInventory, mapVehicle } from './lib/kingofcars-engine-api-v2.mjs'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const UPSERT_BATCH_SIZE = 50

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })

async function upsert(rows) {
  const { data, error } = await supabase.from('KingsOfCars_vehicles').upsert(rows, { onConflict: 'slug' }).select('id,slug')
  if (error) throw error
  return data ?? []
}

async function rebuildImages(vehicles, idsBySlug) {
  const ids = vehicles.map((vehicle) => idsBySlug.get(vehicle.slug)).filter(Boolean)
  if (!ids.length) return
  const { error: deleteError } = await supabase.from('KingsOfCars_vehicle_images').delete().in('vehicle_id', ids)
  if (deleteError) throw deleteError

  const imageRows = []
  for (const vehicle of vehicles) {
    const vehicleId = idsBySlug.get(vehicle.slug)
    for (const [sortOrder, imageUrl] of (vehicle.gallery_urls.entries())) {
      imageRows.push({ vehicle_id: vehicleId, image_url: imageUrl, sort_order: sortOrder, is_primary: sortOrder === 0, alt_text: [vehicle.year, vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(' ') })
    }
  }
  for (let index = 0; index < imageRows.length; index += 500) {
    const { error } = await supabase.from('KingsOfCars_vehicle_images').insert(imageRows.slice(index, index + 500))
    if (error) throw error
  }
}

async function removeStale(activeSlugs) {
  const { data, error } = await supabase.from('KingsOfCars_vehicles').select('id,slug,source_url').ilike('source_url', '%kingofcars.co.za%')
  if (error) throw error
  const staleIds = (data ?? []).filter((row) => !activeSlugs.has(row.slug)).map((row) => row.id)
  if (!staleIds.length) return 0
  const { error: imageError } = await supabase.from('KingsOfCars_vehicle_images').delete().in('vehicle_id', staleIds)
  if (imageError) throw imageError
  const { error: vehicleError } = await supabase.from('KingsOfCars_vehicles').delete().in('id', staleIds)
  if (vehicleError) throw vehicleError
  return staleIds.length
}

async function main() {
  const { rows, finalCount } = await fetchInventory()
  const mapped = rows.map(mapVehicle).filter((vehicle) => vehicle.slug && vehicle.model)
  const vehicles = [...new Map(mapped.map((vehicle) => [vehicle.slug, vehicle])).values()]
  if (vehicles.length < 250 || vehicles.length > 500) throw new Error(`Mapped ${vehicles.length} vehicles; refusing sync.`)
  console.log(`Mapped ${vehicles.length} Boksburg vehicles from source count ${finalCount}.`)

  const imported = []
  for (let index = 0; index < vehicles.length; index += UPSERT_BATCH_SIZE) {
    imported.push(...await upsert(vehicles.slice(index, index + UPSERT_BATCH_SIZE)))
    console.log(`Upserted ${Math.min(index + UPSERT_BATCH_SIZE, vehicles.length)}/${vehicles.length}`)
  }

  const idsBySlug = new Map(imported.map((row) => [row.slug, row.id]))
  await rebuildImages(vehicles, idsBySlug)
  const stale = await removeStale(new Set(vehicles.map((vehicle) => vehicle.slug)))
  console.log(`Removed ${stale} stale King of Cars rows.`)

  const { count: total, error: totalError } = await supabase.from('KingsOfCars_vehicles').select('id', { count: 'exact', head: true })
  if (totalError) throw totalError
  const { count: available, error: availableError } = await supabase.from('KingsOfCars_vehicles').select('id', { count: 'exact', head: true }).eq('status', 'available')
  if (availableError) throw availableError
  if ((available ?? 0) < 250) throw new Error(`Verification failed: available=${available}`)
  console.log(`VERIFIED: total=${total}; available=${available}; source=${finalCount}`)
  console.log('SUCCESS: Boksburg inventory sync completed.')
}

main().catch((error) => { console.error('SYNC FAILED:', error); process.exit(1) })
