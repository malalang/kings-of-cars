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
  if (typeof value === 'object') return first(value.url, value.imageUrl, value.imageURL, value.src, value.href, value.originalUrl, value.largeUrl, value.image)
  return null
}

function looksLikeVehicle(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value).map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, ''))
  return keys.some((key) => [
    'stocknumber', 'stockno', 'stockcode', 'stockid', 'vehicleid', 'vin',
    'make', 'manufacturer', 'model', 'vehiclemodel', 'vehicledescription',
  ].includes(key))
}

// iX has returned several response envelopes over time. Some environments expose
// records directly, while others wrap each record in vehicle/item/result objects.
// Walk the whole JSON tree and unwrap one-record envelopes instead of assuming
// `payload.vehicles` exists.
function unwrapVehicle(value, depth = 0) {
  if (depth > 6 || !value || typeof value !== 'object' || Array.isArray(value)) return value
  for (const key of ['vehicle', 'Vehicle', 'vehicleStock', 'VehicleStock', 'vehicleData', 'VehicleData', 'item', 'Item', 'result', 'Result']) {
    if (value[key] && typeof value[key] === 'object' && looksLikeVehicle(value[key])) return value[key]
  }
  return value
}

function findVehicleArray(value, depth = 0) {
  if (depth > 12 || value === null || value === undefined) return null
  if (Array.isArray(value)) {
    const unwrapped = value.map((item) => unwrapVehicle(item)).filter(Boolean)
    if (unwrapped.length > 0 && unwrapped.every(looksLikeVehicle)) return unwrapped
    for (const item of value) {
      const nested = findVehicleArray(item, depth + 1)
      if (nested) return nested
    }
    return null
  }
  if (typeof value !== 'object') return null
  if (looksLikeVehicle(value)) return [value]
  for (const [key, child] of Object.entries(value)) {
    // Do not skip whole branches merely because their envelope happens to be
    // called price/year/etc.; iX response objects can contain vehicle arrays
    // beneath such keys.
    if (key === '__proto__' || key === 'prototype' || key === 'constructor') continue
    const nested = findVehicleArray(child, depth + 1)
    if (nested) return nested
  }
  return null
}

function extractRows(payload) {
  const rows = findVehicleArray(payload?.vehicles ?? payload)
  if (!rows) {
    const keys = payload && typeof payload === 'object' && !Array.isArray(payload) ? Object.keys(payload) : []
    throw new Error(`Could not locate vehicle array in Engine API response. topLevelKeys=${JSON.stringify(keys)} type=${Array.isArray(payload) ? 'array' : typeof payload}`)
  }
  return rows
}

function extractCount(payload, rows) {
  return integerValue(first(
    payload?.finalCount, payload?.FinalCount,
    payload?.totalVehicleCount, payload?.TotalVehicleCount,
    payload?.searchCount, payload?.SearchCount,
    payload?.count, payload?.Count,
    payload?.data?.finalCount, payload?.data?.FinalCount,
    payload?.data?.totalVehicleCount, payload?.data?.TotalVehicleCount,
    rows.length,
  ))
}

async function request(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      origin: 'https://www.kingofcars.co.za',
      referer: 'https://www.kingofcars.co.za/boksburg-used-cars',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36',
    },
    body: JSON.stringify(payload),
  })
  const text = await response.text()
  let body
  try { body = JSON.parse(text) } catch { body = text }
  if (!response.ok) {
    const detail = typeof body === 'string' ? body.slice(0, 1000) : JSON.stringify(body).slice(0, 1000)
    throw new Error(`King of Cars API ${response.status}: ${detail}`)
  }
  return body
}

export async function fetchInventory() {
  const payload = { LimitToDealer: [DEALER_ID], page: 1, pageSize: PAGE_SIZE }
  const body = await request(payload)
  const rows = extractRows(body)
  const finalCount = extractCount(body, rows)
  console.log(`Engine API v2: rows=${rows.length}; finalCount=${finalCount}; dealer=${DEALER_ID}`)
  if (finalCount < 250 || finalCount > 500) throw new Error(`Expected Boksburg dealer inventory count between 250 and 500, received ${finalCount}. Refusing sync.`)
  if (rows.length < 250 || rows.length > 500) throw new Error(`Expected 250-500 returned vehicle records, received ${rows.length}. Refusing sync.`)
  return { rows, finalCount, payload }
}

export function mapVehicle(vehicle) {
  const images = [
    vehicle.imageUrl, vehicle.imageURL, vehicle.primaryImage, vehicle.primaryImageUrl, vehicle.mainImage, vehicle.thumbnail,
    ...asArray(vehicle.images), ...asArray(vehicle.imageUrls), ...asArray(vehicle.galleryUrls), ...asArray(vehicle.gallery), ...asArray(vehicle.photos), ...asArray(vehicle.pictures), ...asArray(vehicle.media), ...asArray(vehicle.vehicleImages),
  ].map(pickImageUrl).filter(Boolean)
  const uniqueImages = [...new Set(images)]
  const stockNumber = clean(first(vehicle.stockNumber, vehicle.StockNumber, vehicle.stockNo, vehicle.StockNo, vehicle.stockCode, vehicle.StockCode, vehicle.stock, vehicle.Stock, vehicle.reference, vehicle.Reference, vehicle.stockId, vehicle.StockId, vehicle.vehicleId, vehicle.VehicleId, vehicle.vin, vehicle.VIN)) || null
  const year = integerValue(first(vehicle.year, vehicle.Year, vehicle.modelYear, vehicle.ModelYear, vehicle.yearOfManufacture, vehicle.YearOfManufacture))
  const make = clean(first(vehicle.make, vehicle.Make, vehicle.manufacturer, vehicle.Manufacturer, vehicle.brand, vehicle.Brand)) || 'Unknown'
  const model = clean(first(vehicle.model, vehicle.Model, vehicle.vehicleModel, vehicle.VehicleModel, vehicle.description, vehicle.Description)) || `Vehicle ${stockNumber ?? ''}`.trim()
  const variant = clean(first(vehicle.variant, vehicle.Variant, vehicle.derivative, vehicle.Derivative, vehicle.trim, vehicle.Trim, vehicle.vehicleConfiguration, vehicle.VehicleConfiguration)) || null
  const sourceUrl = first(vehicle.sourceUrl, vehicle.SourceUrl, vehicle.url, vehicle.Url, vehicle.detailUrl, vehicle.DetailUrl, vehicle.vehicleUrl, vehicle.VehicleUrl, vehicle.link, vehicle.Link) || null
  const price = numberValue(first(vehicle.price, vehicle.Price, vehicle.sellingPrice, vehicle.SellingPrice, vehicle.cashPrice, vehicle.CashPrice, vehicle.salePrice, vehicle.SalePrice))
  const monthlyPayment = numberValue(first(vehicle.monthlyPayment, vehicle.MonthlyPayment, vehicle.monthly, vehicle.Monthly, vehicle.payment, vehicle.Payment, vehicle.instalment, vehicle.Instalment))
  const mileage = integerValue(first(vehicle.mileage, vehicle.Mileage, vehicle.odometer, vehicle.Odometer, vehicle.km, vehicle.Km, vehicle.kilometres, vehicle.Kilometres))
  const powerKw = integerValue(first(vehicle.powerKw, vehicle.PowerKw, vehicle.powerKW, vehicle.PowerKW, vehicle.kw, vehicle.Kw))
  const description = clean(first(vehicle.description, vehicle.Description, vehicle.comments, vehicle.Comments, vehicle.overview, vehicle.Overview, vehicle.title, vehicle.Title, vehicle.name, vehicle.Name, [year, make, model, variant].filter(Boolean).join(' '))) || null
  const features = [...new Set([...asArray(vehicle.features), ...asArray(vehicle.Features), ...asArray(vehicle.optionalExtras), ...asArray(vehicle.OptionalExtras), ...asArray(vehicle.equipment), ...asArray(vehicle.Equipment)].map(clean).filter(Boolean))]
  const identity = stockNumber || sourceUrl || `${year}-${make}-${model}`
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
    image_url: uniqueImages[0] ?? null,
    gallery_urls: uniqueImages,
    status: 'available',
    featured: false,
    source_url: sourceUrl,
    source_updated_at: new Date().toISOString(),
  }
}

export { DEALER_ID, PAGE_SIZE, API_URL }
