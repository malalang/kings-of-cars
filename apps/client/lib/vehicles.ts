import { supabase } from './supabase'

export async function getVehicles() {
  const { data, error } = await supabase.from('KingsOfCars_vehicles').select('*').eq('status', 'available').order('featured', { ascending: false }).order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  const vehicles = data ?? []
  if (!vehicles.length) return vehicles

  const ids = vehicles.map((vehicle: any) => vehicle.id).filter(Boolean)
  const { data: images, error: imageError } = await supabase.from('KingsOfCars_vehicle_images').select('vehicle_id,image_url,sort_order').in('vehicle_id', ids).order('sort_order', { ascending: true })
  if (imageError) throw new Error(imageError.message)

  const imagesByVehicle = new Map<string, string[]>()
  for (const image of images ?? []) {
    if (!image.vehicle_id || !image.image_url) continue
    const current = imagesByVehicle.get(image.vehicle_id) ?? []
    current.push(image.image_url)
    imagesByVehicle.set(image.vehicle_id, current)
  }

  return vehicles.map((vehicle: any) => ({ ...vehicle, gallery_urls: imagesByVehicle.get(vehicle.id) ?? [] }))
}

export async function getVehicle(slug: string) {
  const { data, error } = await supabase.from('KingsOfCars_vehicles').select('*').eq('slug', slug).eq('status', 'available').maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return data

  const { data: images, error: imageError } = await supabase.from('KingsOfCars_vehicle_images').select('image_url,sort_order').eq('vehicle_id', data.id).order('sort_order', { ascending: true })
  if (imageError) throw new Error(imageError.message)

  return { ...data, gallery_urls: (images ?? []).map((image: any) => image.image_url).filter(Boolean) }
}
