export const CACHE_TAGS = {
  cars: "cars",
  car: (id: string) => `car:${id}`,
} as const;

export const CACHE_PATHS = {
  home: "/",
  cars: "/cars",
  carDetail: (slug: string) => `/cars/${slug}`,
} as const;
