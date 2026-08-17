import { supabase } from './supabase'

export async function getVehicles() {
  const { data, error } = await supabase.from('KingsOfCars_vehicles').select('*').eq('status', 'available').order('featured', { ascending: false }).order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getVehicle(slug: string) {
  const { data, error } = await supabase.from('KingsOfCars_vehicles').select('*').eq('slug', slug).eq('status', 'available').maybeSingle()
  if (error) throw new Error(error.message)
  return data
}
