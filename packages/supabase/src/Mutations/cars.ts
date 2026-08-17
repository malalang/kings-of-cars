type SupabaseClientLike = {
  from: (table: string) => any
}

export async function createCar(supabase: SupabaseClientLike, input: Record<string, unknown>) {
  const { data, error } = await supabase.from('cars').insert(input).select('*').single()
  if (error) throw error
  return data
}

export async function updateCar(supabase: SupabaseClientLike, id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase.from('cars').update(input).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function deleteCar(supabase: SupabaseClientLike, id: string) {
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw error
}
