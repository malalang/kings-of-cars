import type { CarType } from "@kings-of-cars/contracts/car";
import { createSupabasePublicClient } from "../server";
import type { Database } from "../supabaseType";

type CarRow = Database["public"]["Tables"]["KingsOfCars_vehicles"]["Row"];

function normalizeCar(row: CarRow, galleryUrls: string[]): CarType {
  return {
    id: row.id,
    stockNumber: row.stock_number,
    slug: row.slug,
    make: row.make,
    model: row.model,
    variant: row.variant,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    monthlyPayment: row.monthly_payment,
    bodyType: row.body_type,
    transmission: row.transmission,
    fuelType: row.fuel_type,
    colour: row.colour,
    engineSize: row.engine_size,
    powerKw: row.power_kw,
    description: row.description,
    overview: row.overview,
    features: row.features ?? [],
    healthCheck: (row.health_check ?? {}) as CarType["healthCheck"],
    imageUrl: row.image_url,
    galleryUrls,
    status: row.status,
    featured: row.featured,
    sourceUrl: row.source_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function loadGallery(
  supabase: ReturnType<typeof createSupabasePublicClient>,
  carIds: string[],
) {
  const { data, error } = await supabase
    .from("KingsOfCars_vehicle_images")
    .select("vehicle_id, image_url")
    .in("vehicle_id", carIds)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to load vehicle images: ${error.message}`);
  }

  const galleryByCar = new Map<string, string[]>();
  for (const image of data ?? []) {
    if (!image.vehicle_id || !image.image_url) continue;
    const current = galleryByCar.get(image.vehicle_id) ?? [];
    current.push(image.image_url);
    galleryByCar.set(image.vehicle_id, current);
  }
  return galleryByCar;
}

export async function getCars(): Promise<CarType[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .select("*")
    .eq("status", "available")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load vehicles: ${error.message}`);
  }

  const rows = data ?? [];
  const galleryByCar = rows.length
    ? await loadGallery(
        supabase,
        rows.map((row) => row.id),
      )
    : new Map<string, string[]>();

  return rows.map((row) => normalizeCar(row, galleryByCar.get(row.id) ?? []));
}

export async function getCarBySlug(slug: string): Promise<CarType | undefined> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load vehicle: ${error.message}`);
  }

  if (!data) return undefined;
  const galleryByCar = await loadGallery(supabase, [data.id]);
  return normalizeCar(data, galleryByCar.get(data.id) ?? []);
}
