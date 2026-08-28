#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// All supplied King of Cars Boksburg listings are POA.
// A NULL numeric price is intentional: the client renders NULL as POA.
const { data, error } = await supabase
  .from('KingsOfCars_vehicles')
  .update({ price: null })
  .eq('source_url', 'https://www.kingofcars.co.za/boksburg-used-cars')
  .select('id,stock_number,slug')

if (error) throw new Error(`Unable to normalize POA vehicles: ${error.message}`)

console.log(`Normalized ${data?.length ?? 0} King of Cars vehicles to POA.`)
