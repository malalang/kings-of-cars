export const CACHE_TAGS = {
  cars: 'cars',
  car: (id: string) => `car:${id}`,
  leads: 'leads',
  articles: 'articles',
  finance: 'finance',
} as const
