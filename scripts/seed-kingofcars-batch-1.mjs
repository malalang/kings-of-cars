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

const cars = [
  {
    stock_number: '9089517',
    slug: '2025-toyota-land-cruiser-79-2-8-gd-6-d-c-at-9089517',
    make: 'Toyota',
    model: 'Land Cruiser 79',
    variant: '2.8 GD-6 D/C AT',
    year: 2025,
    mileage: null,
    price: 1499950,
    body_type: 'Double Cab',
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    colour: 'White',
    description: 'Toyota Land Cruiser 79 2.8 GD-6 D/C AT',
    overview: 'Toyota Land Cruiser 79 2.8 GD-6 D/C AT',
    source_url: 'https://www.kingofcars.co.za/boksburg-used-cars',
    source_updated_at: new Date().toISOString(),
    status: 'available',
    gallery_urls: [
      'https://image.blob.ix.co.za/Used/9089517/1/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-1-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/2/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-2-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/3/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-3-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/4/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-4-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/5/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-5-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/6/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-6-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/7/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-7-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/8/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-8-832x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/9/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-9-1023x768.jpg',
      'https://image.blob.ix.co.za/Used/9089517/10/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-10-1023x768.jpg',
    ],
  },
  {
    stock_number: '8927634', slug: '2024-ineos-grenadier-3-0td-8927634', make: 'INEOS', model: 'Grenadier', variant: '3.0TD', year: 2024, mileage: null, price: null, body_type: 'SUV', transmission: null, fuel_type: 'Diesel', colour: 'White', description: 'INEOS Grenadier 3.0TD', overview: 'INEOS Grenadier 3.0TD', source_url: 'https://www.kingofcars.co.za/boksburg-used-cars', source_updated_at: new Date().toISOString(), status: 'available', gallery_urls: [
      'https://image.blob.ix.co.za/Used/8927634/1/2024-White-INEOS-Grenadier-30TD-8927634-1-630x767.jpg','https://image.blob.ix.co.za/Used/8927634/2/2024-White-INEOS-Grenadier-30TD-8927634-2-1023x768.jpg','https://image.blob.ix.co.za/Used/8927634/3/2024-White-INEOS-Grenadier-30TD-8927634-3-1023x768.jpg','https://image.blob.ix.co.za/Used/8927634/4/2024-White-INEOS-Grenadier-30TD-8927634-4-624x767.jpg','https://image.blob.ix.co.za/Used/8927634/5/2024-White-INEOS-Grenadier-30TD-8927634-5-853x768.jpg','https://image.blob.ix.co.za/Used/8927634/6/2024-White-INEOS-Grenadier-30TD-8927634-6-1023x768.jpg','https://image.blob.ix.co.za/Used/8927634/7/2024-White-INEOS-Grenadier-30TD-8927634-7-1023x768.jpg','https://image.blob.ix.co.za/Used/8927634/8/2024-White-INEOS-Grenadier-30TD-8927634-8-1023x768.jpg'
    ]
  },
  {
    stock_number: '8898568', slug: '2026-volkswagen-amarok-3-0-tdi-v6-4motion-panamericana-auto-d-c-8898568', make: 'Volkswagen', model: 'Amarok', variant: '3.0 TDI V6 4Motion PanAmericana Auto D/C', year: 2026, mileage: null, price: null, body_type: 'Double Cab', transmission: 'Automatic', fuel_type: 'Diesel', colour: 'White', description: 'Volkswagen Amarok 3.0 TDI V6 4Motion PanAmericana Auto D/C', overview: 'Volkswagen Amarok 3.0 TDI V6 4Motion PanAmericana Auto D/C', source_url: 'https://www.kingofcars.co.za/boksburg-used-cars', source_updated_at: new Date().toISOString(), status: 'available', gallery_urls: [
      'https://image.blob.ix.co.za/Used/8898568/1/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-1-1023x768.jpg','https://image.blob.ix.co.za/Used/8898568/2/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-2-1023x768.jpg','https://image.blob.ix.co.za/Used/8898568/3/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-3-1023x768.jpg','https://image.blob.ix.co.za/Used/8898568/4/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-4-1023x768.jpg','https://image.blob.ix.co.za/Used/8898568/5/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-5-867x768.jpg','https://image.blob.ix.co.za/Used/8898568/6/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-6-1023x768.jpg','https://image.blob.ix.co.za/Used/8898568/7/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-7-1023x768.jpg','https://image.blob.ix.co.za/Used/8898568/8/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-8-1023x768.jpg'
    ]
  },
  {
    stock_number: '8764953', slug: '2020-toyota-land-cruiser-79-4-5d-v8-p-u-d-c-8764953', make: 'Toyota', model: 'Land Cruiser 79', variant: '4.5D V8 P/U D/C', year: 2020, mileage: null, price: null, body_type: 'Double Cab', transmission: null, fuel_type: 'Diesel', colour: 'White', description: 'Toyota Land Cruiser 79 4.5D V8 P/U D/C', overview: 'Toyota Land Cruiser 79 4.5D V8 P/U D/C', source_url: 'https://www.kingofcars.co.za/boksburg-used-cars', source_updated_at: new Date().toISOString(), status: 'available', gallery_urls: Array.from({ length: 9 }, (_, i) => `https://image.blob.ix.co.za/Used/8764953/${i + 1}/2020-White-Toyota-Land-Cruiser-79-79-45D-V8-PU-DC-8764953-${i + 1}-1023x768.jpg`)
  },
  {
    stock_number: '9011950', slug: '2023-ineos-grenadier-3-0td-trialmaster-9011950', make: 'INEOS', model: 'Grenadier', variant: '3.0TD Trialmaster', year: 2023, mileage: null, price: null, body_type: 'SUV', transmission: null, fuel_type: 'Diesel', colour: 'Beige', description: 'INEOS Grenadier 3.0TD Trialmaster', overview: 'INEOS Grenadier 3.0TD Trialmaster', source_url: 'https://www.kingofcars.co.za/boksburg-used-cars', source_updated_at: new Date().toISOString(), status: 'available', gallery_urls: Array.from({ length: 16 }, (_, i) => `https://image.blob.ix.co.za/Used/9011950/${i + 1}/2023-Beige-INEOS-Grenadier-30TD-Trialmaster-9011950-${i + 1}-1023x768.jpg`)
  },
  {
    stock_number: '9027426', slug: '2017-porsche-718-cayman-s-9027426', make: 'Porsche', model: '718 Cayman', variant: 'S', year: 2017, mileage: null, price: null, body_type: 'Coupe', transmission: null, fuel_type: null, colour: 'White', description: 'Porsche 718 Cayman S', overview: 'Porsche 718 Cayman S', source_url: 'https://www.kingofcars.co.za/boksburg-used-cars', source_updated_at: new Date().toISOString(), status: 'available', gallery_urls: Array.from({ length: 13 }, (_, i) => `https://image.blob.ix.co.za/Used/9027426/${i + 1}/2017-White-Porsche-Cayman-718-Cayman-S-9027426-${i + 1}-1023x768.jpg`)
  },
]

for (const car of cars) {
  const image_url = car.gallery_urls[0] ?? null
  const { gallery_urls, ...vehicle } = car
  const { data, error } = await supabase.from('KingsOfCars_vehicles').upsert({ ...vehicle, image_url }, { onConflict: 'slug' }).select('id,slug').single()
  if (error) throw new Error(`${car.stock_number}: ${error.message}`)

  const { error: deleteError } = await supabase.from('KingsOfCars_vehicle_images').delete().eq('vehicle_id', data.id)
  if (deleteError) throw new Error(`${car.stock_number}: ${deleteError.message}`)

  if (gallery_urls.length) {
    const rows = gallery_urls.map((image_url, sort_order) => ({ vehicle_id: data.id, image_url, sort_order, is_primary: sort_order === 0, alt_text: car.variant ? `${car.make} ${car.model} ${car.variant}` : `${car.make} ${car.model}` }))
    const { error: imageError } = await supabase.from('KingsOfCars_vehicle_images').insert(rows)
    if (imageError) throw new Error(`${car.stock_number}: ${imageError.message}`)
  }

  console.log(`Seeded ${car.stock_number}: ${car.make} ${car.model}`)
}

console.log(`Seeded ${cars.length} vehicles.`)
