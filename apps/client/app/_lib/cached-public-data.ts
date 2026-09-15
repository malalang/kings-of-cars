import { CACHE_TAGS } from "@kings-of-cars/supabase/cache";
import { getCarBySlug, getCars } from "@kings-of-cars/supabase/Queries/cars";
import { unstable_cache } from "next/cache";

export const getCachedCars = async () =>
  unstable_cache(async () => getCars(), ["cars"], {
    tags: [CACHE_TAGS.cars],
  })();

export const getCachedCarBySlug = async (slug: string) =>
  unstable_cache(async () => getCarBySlug(slug), [`car-${slug}`], {
    tags: [CACHE_TAGS.cars],
  })();
