const API_URL = process.env.KINGS_OF_CARS_ENGINE_API_URL ?? 'https://engineapi.e5.ix.co.za/api/v1.0/vehiclestocksearch/filter'
const DEALER_ID = Number(process.env.KINGS_OF_CARS_DEALER_ID ?? 13400)
const PAGE_SIZE = Number(process.env.KINGS_OF_CARS_PAGE_SIZE ?? 500)

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')
const numberValue = (value) => {
  if (value === null || value === undefined || value === '') return null
  const number = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(number) ? number : null
}
const integerValue = (value) => {
  const number = numberValue(value)
  return number === null ? null : Math.round(number)
}
const asArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(/[,|\n]/).map(clean).filter(Boolean)
  return []
}
const pickImageUrl = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object') return first(value.url, value.imageUrl, value.imageURL, value.src, value.href, value.originalUrl, value.largeUrl)
  return null
}

function extractImages(vehicle) {
  const candidates = [vehicle.images, vehicle.imageUrls, vehicle.galleryUrls, vehicle.gallery, vehicle.photos, vehicle.pictures, vehicle.media, vehicle.vehicleImages, vehicle.imageList]
  const urls = candidates.flatMap(asArray).map(pickImageUrl).filter(Boolean)
  const direct = [vehicle.imageUrl, vehicle.imageURL, vehicle.primaryImage, vehicle.primaryImageUrl, vehicle.mainImage, vehicle.thumbnail].map(pickImageUrl).filter(Boolean)
  return [...new Set([...direct, ...urls])]
}

function extractRows(payload) {
  const candidates = [payload?.vehicles, payload?.Vehicles, payload?.results, payload?.Results, payload?.items, payload?.Items, payload?.data, payload?.Data, payload?.stock, payload?.Stock]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
    if (candidate && typeof candidate === 'object') {
      for (const nested of [candidate.items, candidate.results, candidate.vehicles, candidate.data]) {
        if (Array.isArray(nested)) return nested
      }
    }
  }
  return Array.isArray(payload) ? payload : []
}

function extractCount(payload, rows) {
  return integerValue(first(payload?.finalCount, payload?.FinalCount, payload?.totalCount, payload?.TotalCount, payload?.count, payload?.Count, payload?.pagination?.total, payload?.Pagination?.Total, rows.length))
}

async function request(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      origin: 'https://www.kingofcars.co.za',
      referer: 'https://www.kingofcars.co.za/',
      'user-agent': 'KingsOfCarsInventorySync/1.0',
    },
    body: JSON.stringify(payload),
  })
  const text = await response.text()
  let body
  try { body = JSON.parse(text) } catch { body = text }
  if (!response.ok) {
    const detail = typeof body === 'string' ? body.slice(0, 500) : JSON.stringify(body).slice(0, 500)
    throw new Error(`King of Cars API ${response.status}: ${detail}`)
  }
  return body
}

export async function fetchInventory() {
  const payloads = [
    { LimitToDealer: [DEALER_ID], page: 1, pageSize: PAGE_SIZE },
    { LimitToDealer: [DEALER_ID], Page: 1, PageSize: PAGE_SIZE },
    { limitToDealer: [DEALER_ID], page: 1, pageSize: PAGE_SIZE },
  ]
  let lastError
  for (const payload of payloads) {
    try {
      const body = await request(payload)
      const rows = extractRows(body)
      if (rows.length > 0) return { rows, finalCount: extractCount(body, rows), payload }
    } catch (error) { lastError = error }
  }
  throw lastError ?? new Error('King of Cars API returned no vehicle rows.')
}

export function mapVehicle(vehicle) {
  const images = extractImages(vehicle)
  const stockNumber = clean(first(vehicle.stockNumber, vehicle.StockNumber, vehicle.stockNo, vehicle.StockNo, vehicle.stockCode, vehicle.StockCode, vehicle.stock, vehicle.Stock, vehicle.reference, vehicle.Reference, vehicle.stockId, vehicle.StockId)) || null
  const year = integerValue(first(vehicle.year, vehicle.Year, vehicle.modelYear, vehicle.ModelYear, vehicle.yearOfManufacture, vehicle.YearOfManufacture))
  const make = clean(first(vehicle.make, vehicle.Make, vehicle.manufacturer, vehicle.Manufacturer, vehicle.brand, vehicle.Brand)) || 'Unknown'
  const model = clean(first(vehicle.model, vehicle.Model, vehicle.vehicleModel, vehicle.VehicleModel, vehicle.description, vehicle.Description)) || `Vehicle ${stockNumber ?? ''}`.trim()
  const variant = clean(first(vehicle.variant, vehicle.Variant, vehicle.derivative, vehicle.Derivative, vehicle.trim, vehicle.Trim)) || null
  const name = clean(first(vehicle.title, vehicle.Title, vehicle.name, vehicle.Name, vehicle.displayName, vehicle.DisplayName, [year, make, model, variant].filter(Boolean).join(' ')))
  const sourceUrl = first(vehicle.sourceUrl, vehicle.SourceUrl, vehicle.url, vehicle.Url, vehicle.detailUrl, vehicle.DetailUrl, vehicle.vehicleUrl, vehicle.VehicleUrl, vehicle.link, vehicle.Link) || null
  const price = numberValue(first(vehicle.price, vehicle.Price, vehicle.sellingPrice, vehicle.SellingPrice, vehicle.cashPrice, vehicle.CashPrice, vehicle.salePrice, vehicle.SalePrice))
  const monthlyPayment = numberValue(first(vehicle.monthlyPayment, vehicle.MonthlyPayment, vehicle.monthly, vehicle.Monthly, vehicle.payment, vehicle.Payment))
  const mileage = integerValue(first(vehicle.mileage, vehicle.Mileage, vehicle.odometer, vehicle.Odometer, vehicle.km, vehicle.Km, vehicle.kilometres, vehicle.Kilometres))
  const powerKw = integerValue(first(vehicle.powerKw, vehicle.PowerKw, vehicle.powerKW, vehicle.PowerKW, vehicle.kw, vehicle.Kw))
  const description = clean(first(vehicle.description, vehicle.Description, vehicle.comments, vehicle.Comments, vehicle.overview, vehicle.Overview, name)) || null
  const features = [...new Set([...asArray(vehicle.features), ...asArray(vehicle.Features), ...asArray(vehicle.optionalExtras), ...asArray(vehicle.OptionalExtras), ...asArray(vehicle.equipment), ...asArray(vehicle.Equipment)].map(clean).filter(Boolean))]
  const identity = stockNumber || sourceUrl || name
  const slug = clean(`${year ?? ''}-${make}-${model}-${variant ?? ''}-${identity}`).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  return {
    stock_number: stockNumber,
    slug,
    make,
    model,
    variant,
    year,
    mileage,
    price,
    monthly_payment: monthlyPayment,
    body_type: clean(first(vehicle.bodyType, vehicle.BodyType, vehicle.body, vehicle.Body)) || null,
    transmission: clean(first(vehicle.transmission, vehicle.Transmission, vehicle.gearbox, vehicle.Gearbox)) || null,
    fuel_type: clean(first(vehicle.fuelType, vehicle.FuelType, vehicle.fuel, vehicle.Fuel)) || null,
    colour: clean(first(vehicle.colour, vehicle.Colour, vehicle.color, vehicle.Color, vehicle.exteriorColour, vehicle.ExteriorColour)) || null,
    engine_size: clean(first(vehicle.engineSize, vehicle.EngineSize, vehicle.engine, vehicle.Engine, vehicle.engineCapacity, vehicle.EngineCapacity)) || null,
    power_kw: powerKw,
    description,
    overview: clean(first(vehicle.overview, vehicle.Overview, description)) || null,
    features,
    health_check: vehicle.healthCheck ?? vehicle.HealthCheck ?? null,
    image_url: images[0] ?? null,
    gallery_urls: images,
    status: 'available',
    featured: false,
    source_url: sourceUrl,
    source_updated_at: new Date().toISOString(),
  }
}

export { DEALER_ID, PAGE_SIZE, API_URL }
