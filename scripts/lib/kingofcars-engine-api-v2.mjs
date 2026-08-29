const API_URL = process.env.KINGS_OF_CARS_ENGINE_API_URL ?? 'https://engineapi.e5.ix.co.za/api/v1.0/vehiclestocksearch/filter'
const DEALER_ID = Number(process.env.KINGS_OF_CARS_DEALER_ID ?? 13400)
const PAGE_SIZE = Math.min(Number(process.env.KINGS_OF_CARS_PAGE_SIZE ?? 100), 100)

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

function unwrapVehicle(value, depth = 0) {
  if (depth > 6 || !value || typeof value !== 'object' || Array.isArray(value)) return value
  for (const key of ['vehicle', 'Vehicle', 'vehicleStock', 'VehicleStock', 'vehicleData', 'VehicleData', 'item', 'Item', 'result', 'Result']) {
    if (value[key] && typeof value[key] === 'object' && !Array.isArray(value[key])) return value[key]
  }
  return value
}

function extractRows(payload) {
  if (payload && Array.isArray(payload.vehicles)) return payload.vehicles.map(unwrapVehicle)
  if (Array.isArray(payload)) return payload.map(unwrapVehicle)
  throw new Error(`Could not locate vehicle array in Engine API response. topLevelKeys=${JSON.stringify(payload && typeof payload === 'object' ? Object.keys(payload) : [])} type=${Array.isArray(payload) ? 'array' : typeof payload}`)
}

function extractCount(payload, rows) {
  return integerValue(first(
    payload?.finalCount, payload?.FinalCount,
    payload?.totalVehicleCount, payload?.TotalVehicleCount,
    payload?.searchCount, payload?.SearchCount,
    payload?.count, payload?.Count,
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

function vehicleIdentity(vehicle) {
  return clean(first(
    vehicle.stockNumber, vehicle.StockNumber, vehicle.stockNo, vehicle.StockNo,
    vehicle.stockCode, vehicle.StockCode, vehicle.stock, vehicle.Stock,
    vehicle.reference, vehicle.Reference, vehicle.stockId, vehicle.StockId,
    vehicle.vehicleId, vehicle.VehicleId, vehicle.vin, vehicle.VIN,
    vehicle.sourceUrl, vehicle.SourceUrl, vehicle.url, vehicle.Url,
  ))
}

export async function fetchInventory() {
  const all = []
  const seen = new Set()
  let finalCount = null

  // The iX endpoint advertises a larger count but can silently cap a single
  // response. Fetch explicit pages and combine them. This is important for
  // Vercel, where we must never mistake a partial page for the full inventory.
  for (let page = 1; page <= 10; page += 1) {
    const payload = { LimitToDealer: [DEALER_ID], page, pageSize: PAGE_SIZE }
    const body = await request(payload)
    const rows = extractRows(body)
    const count = extractCount(body, rows)
    if (finalCount === null) finalCount = count

    let added = 0
    for (const row of rows) {
      const key = vehicleIdentity(row) || JSON.stringify(row)
      if (!seen.has(key)) {
        seen.add(key)
        all.push(row)
        added += 1
      }
    }
    console.log(`Engine API v2: page=${page}; rows=${rows.length}; added=${added}; collected=${all.length}; finalCount=${count}; dealer=${DEALER_ID}`)

    if (all.length >= finalCount) break
    if (rows.length === 0 || added === 0) break
  }

  if (finalCount === null) finalCount = all.length
  console.log(`Engine API v2 COMPLETE: rows=${all.length}; finalCount=${finalCount}; dealer=${DEALER_ID}`)

  if (finalCount < 250 || finalCount > 500) throw new Error(`Expected Boksburg dealer inventory count between 250 and 500, received ${finalCount}. Refusing sync.`)
  if (all.length < 250 || all.length > 500) throw new Error(`Expected 250-500 returned vehicle records after pagination, received ${all.length}. Refusing sync.`)
  return { rows: all, finalCount, payload: { LimitToDealer: [DEALER_ID], pageSize: PAGE_SIZE } }
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
    stock_number: stockNumber, slug, make, model, variant, year, mileage, price, monthly_payment: monthlyPayment,
    body_type: clean(first(vehicle.bodyType, vehicle.BodyType, vehicle.body, vehicle.Body)) || null,
    transmission: clean(first(vehicle.transmission, vehicle.Transmission, vehicle.gearbox, vehicle.Gearbox)) || null,
    fuel_type: clean(first(vehicle.fuelType, vehicle.FuelType, vehicle.fuel, vehicle.Fuel)) || null,
    colour: clean(first(vehicle.colour, vehicle.Colour, vehicle.color, vehicle.Color, vehicle.exteriorColour, vehicle.ExteriorColour)) || null,
    engine_size: clean(first(vehicle.engineSize, vehicle.EngineSize, vehicle.engine, vehicle.Engine, vehicle.engineCapacity, vehicle.EngineCapacity)) || null,
    power_kw: powerKw, description, overview: clean(first(vehicle.overview, vehicle.Overview, description)) || null,
    features, health_check: vehicle.healthCheck ?? vehicle.HealthCheck ?? null,
    image_url: uniqueImages[0] ?? null, gallery_urls: uniqueImages, status: 'available', featured: false,
    source_url: sourceUrl, source_updated_at: new Date().toISOString(),
  }
}

export { DEALER_ID, PAGE_SIZE, API_URL }
