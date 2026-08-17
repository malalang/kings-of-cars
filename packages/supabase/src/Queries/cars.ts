type SupabaseClientLike = {
  from: (table: string) => any
}

export async function getPublishedCars(supabase: SupabaseClientLike) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'published')
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data ?? []
}
