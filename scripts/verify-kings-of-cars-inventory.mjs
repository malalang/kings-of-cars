#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const { count: total, error: totalError } = await supabase
  .from('KingsOfCars_vehicles')
  .select('id', { count: 'exact', head: true })
if (totalError) throw totalError

const { count: available, error: availableError } = await supabase
  .from('KingsOfCars_vehicles')
  .select('id', { count: 'exact', head: true })
  .eq('status', 'available')
if (availableError) throw availableError

const { count: sourceRows, error: sourceError } = await supabase
  .from('KingsOfCars_vehicles')
  .select('id', { count: 'exact', head: true })
  .ilike('source_url', '%kingofcars.co.za%')
if (sourceError) throw sourceError

const { count: withImages, error: imageError } = await supabase
  .from('KingsOfCars_vehicles')
  .select('id', { count: 'exact', head: true })
  .ilike('source_url', '%kingofcars.co.za%')
  .not('image_url', 'is', null)
if (imageError) throw imageError

console.log(JSON.stringify({ total, available, kingOfCarsSourceRows: sourceRows, kingOfCarsRowsWithImages: withImages }, null, 2))

if ((sourceRows ?? 0) < 50) throw new Error(`Verification failed: only ${sourceRows ?? 0} King of Cars rows are present.`)
if ((withImages ?? 0) < 50) throw new Error(`Verification failed: only ${withImages ?? 0} King of Cars rows have primary images.`)

console.log('VERIFIED: at least 50 King of Cars vehicles with images are present in Supabase.')
