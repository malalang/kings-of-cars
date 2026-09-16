import type { RevalidationRequest } from "@kings-of-cars/contracts/revalidation";

export const CACHE_TAGS = {
  cars: "cars",
  car: (id: string) => `car:${id}`,
  articles: "articles",
} as const;

export const CACHE_PATHS = {
  home: "/",
  cars: "/cars",
  carDetail: (slug: string) => `/cars/${slug}`,
} as const;

export interface MutationResult<T> {
  data: T;
  revalidate: RevalidationRequest;
}

export function mutationResult<T>(
  data: T,
  revalidate: RevalidationRequest,
): MutationResult<T> {
  return { data, revalidate };
}
