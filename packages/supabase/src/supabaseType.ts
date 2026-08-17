export type Database = {
  public: {
    Tables: Record<string, {
      Row: Record<string, unknown>
      Insert: Record<string, unknown>
      Update: Record<string, unknown>
      Relationships: []
    }>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, string>
    CompositeTypes: Record<string, never>
  }
}

// Replace this scaffold with generated Supabase types after the first schema is deployed.
