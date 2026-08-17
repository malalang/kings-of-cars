type SupabaseClientLike = {
  from: (table: string) => any
}

export async function createLead(supabase: SupabaseClientLike, input: Record<string, unknown>) {
  const { data, error } = await supabase.from('leads').insert(input).select('*').single()
  if (error) throw error
  return data
}

export async function updateLead(supabase: SupabaseClientLike, id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase.from('leads').update(input).eq('id', id).select('*').single()
  if (error) throw error
  return data
}
