const API_URL = process.env.KINGS_OF_CARS_ENGINE_API_URL ?? 'https://engineapi.e5.ix.co.za/api/v1.0/vehiclestocksearch/filter'
const DEALER_ID = Number(process.env.KINGS_OF_CARS_DEALER_ID ?? 13400)
const PAGE_SIZE = Math.min(Number(process.env.KINGS_OF_CARS_PAGE_SIZE ?? 100), 100)
const MIN_SYNC_ROWS = Math.max(Number(process.env.KINGS_OF_CARS_MIN_SYNC_ROWS ?? 50), 1)

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
  if (typeof value === 'object') return first(value.url, value.imageUrl, value.imageURL, value.src, value.href, value.originalUrl, value.largeUrl, value.image, value.ImageUrl, value.ImageURL)
  return null
}

function unwrapVehicle(value, depth = 0) {
  if (depth > 6 || !value || typeof value !== 'object' || Array.isArray(value)) return value
  for (const key of ['vehicle', 'Vehicle', 'vehicleStock', 'VehicleStock', 'vehicleData', 'VehicleData', 'vehicleDetails', 'VehicleDetails', 'item', 'Item', 'result', 'Result']) {
    if (value[key] && typeof value[key] === 'object' && !Array.isArray(value[key])) return unwrapVehicle(value[key], depth + 1)
  }
  return value
}

function extractRows(payload) {
  if (payload && Array.isArray(payload.vehicles)) return payload.vehicles.map(unwrapVehicle)
  if (Array.isArray(payload)) return payload.map(unwrapVehicle)
  throw new Error(`Could not locate vehicle array in Engine API response. topLevelKeys=${JSON.stringify(payload && typeof payload === 'object' ? Object.keys(payload) : [])} type=${Array.isArray(payload) ? 'array' : typeof payload}`)
}

function extractCount(payload, rows) {
  return integerValue(first(payload?.finalCount, payload?.FinalCount, payload?.totalVehicleCount, payload?.TotalVehicleCount, payload?.searchCount, payload?.SearchCount, payload?.count, payload?.Count, rows.length))
}

async function request(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { accept: 'application/json, text/plain, */*', 'content-type': 'application/json', origin: 'https://www.kingofcars.co.za', referer: 'https://www.kingofcars.co.za/boksburg-used-cars', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36' },
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
  return clean(first(vehicle.stockNumber, vehicle.StockNumber, vehicle.stockNo, vehicle.StockNo, vehicle.stockCode, vehicle.StockCode, vehicle.stock, vehicle.Stock, vehicle.reference, vehicle.Reference, vehicle.stockId, vehicle.StockId, vehicle.vehicleId, vehicle.VehicleId, vehicle.vin, vehicle.VIN, vehicle.vehicleStockId, vehicle.VehicleStockId, vehicle.id, vehicle.Id, vehicle.sourceUrl, vehicle.SourceUrl, vehicle.url, vehicle.Url))
}

export async function fetchInventory() {
  const all = []
  const seen = new Set()
  let finalCount = null
  for (let page = 1; page <= 10; page += 1) {
    const payload = { LimitToDealer: [DEALER_ID], page, pageSize: PAGE_SIZE }
    const body = await request(payload)
    const rows = extractRows(body)
    const count = extractCount(body, rows)
    if (finalCount === null) finalCount = count
    let added = 0
    for (const row of rows) {
      const key = vehicleIdentity(row) || JSON.stringify(row)
      if (!seen.has(key)) { seen.add(key); all.push(row); added += 1 }
    }
    console.log(`Engine API v2: page=${page}; rows=${rows.length}; added=${added}; collected=${all.length}; finalCount=${count}; dealer=${DEALER_ID}`)
    if (rows.length === 0 || added === 0) break
    if (finalCount !== null && all.length >= finalCount) break
  }
  if (finalCount === null) finalCount = all.length
  const partial = all.length < finalCount
  console.log(`Engine API v2 COMPLETE: rows=${all.length}; finalCount=${finalCount}; dealer=${DEALER_ID}; partial=${partial}`)
  if (partial) console.warn(`Engine API v2 WARNING: source reports ${finalCount} vehicles but returned ${all.length}; importing returned rows without destructive stale-row deletion.`)
  if (all.length < MIN_SYNC_ROWS) throw new Error(`Expected at least ${MIN_SYNC_ROWS} returned vehicle records, received ${all.length}. Refusing sync.`)
  return { rows: all, finalCount, partial, payload: { LimitToDealer: [DEALER_ID], pageSize: PAGE_SIZE } }
}

function valuesByName(vehicle, names) {
  const wanted = new Set(names.map((name) => name.toLowerCase()))
  const found = []
  const walk = (obj, depth = 0) => {
    if (!obj || typeof obj !== 'object' || depth > 3) return
    for (const [key, value] of Object.entries(obj)) {
      if (wanted.has(key.toLowerCase())) found.push(value)
      if (value && typeof value === 'object' && !Array.isArray(value)) walk(value, depth + 1)
    }
  }
  walk(vehicle)
  return found
}

function field(vehicle, names, fallback = null) {
  return first(...valuesByName(vehicle, names), fallback)
}

function diagnosticKeys(vehicle) {
  const keys = new Set()
  const walk = (obj, depth = 0) => {
    if (!obj || typeof obj !== 'object' || depth > 2) return
    for (const [key, value] of Object.entries(obj)) {
      keys.add(key)
      if (value && typeof value === 'object' && !Array.isArray(value)) walk(value, depth + 1)
    }
  }
  walk(vehicle)
  return [...keys].sort()
}

export function mapVehicle(vehicle) {
  const images = [
    field(vehicle, ['imageUrl', 'imageURL', 'primaryImage', 'primaryImageUrl', 'mainImage', 'thumbnail']),
    ...asArray(field(vehicle, ['images', 'imageUrls', 'galleryUrls', 'gallery', 'photos', 'pictures', 'media', 'vehicleImages'])),
  ].map(pickImageUrl).filter(Boolean)
  const uniqueImages = [...new Set(images)]

  const stockNumber = clean(first(field(vehicle, ['stockNumber', 'stockNo', 'stockCode', 'stock', 'reference', 'stockId', 'vehicleId', 'vin', 'vehicleStockId', 'id']), null)) || null
  const year = integerValue(field(vehicle, ['year', 'modelYear', 'yearOfManufacture', 'manufactureYear']))
  const make = clean(first(field(vehicle, ['make', 'manufacturer', 'brand', 'makeName', 'manufacturerName', 'makeDescription']), 'Unknown')) || 'Unknown'
  const model = clean(first(field(vehicle, ['model', 'vehicleModel', 'modelName', 'modelDescription']), null)) || clean(first(field(vehicle, ['description', 'title', 'name', 'vehicleName']), `Vehicle ${stockNumber ?? ''}`)) || `Vehicle ${stockNumber ?? ''}`.trim()
  const variant = clean(first(field(vehicle, ['variant', 'derivative', 'trim', 'vehicleConfiguration', 'variantName', 'derivativeName', 'vehicleVariant']), null)) || null
  const sourceUrl = first(field(vehicle, ['sourceUrl', 'url', 'detailUrl', 'vehicleUrl', 'link', 'stockUrl']), null) || null
  const price = numberValue(field(vehicle, ['price', 'sellingPrice', 'cashPrice', 'salePrice', 'retailPrice', 'vehiclePrice']))
  const monthlyPayment = numberValue(field(vehicle, ['monthlyPayment', 'monthly', 'payment', 'instalment', 'installment']))
  const mileage = integerValue(field(vehicle, ['mileage', 'odometer', 'km', 'kilometres', 'kilometers', 'odometerReading']))
  const powerKw = integerValue(field(vehicle, ['powerKw', 'powerKW', 'kw', 'kilowatts']))
  const bodyType = clean(first(field(vehicle, ['bodyType', 'body', 'bodyStyle', 'shape', 'shapeName', 'vehicleShape', 'vehicleType', 'vehicleBodyType', 'bodyDescription']), null)) || null
  const transmission = clean(first(field(vehicle, ['transmission', 'gearbox', 'gearboxType', 'transmissionType', 'gearType', 'transmissionDescription']), null)) || null
  const fuelType = clean(first(field(vehicle, ['fuelType', 'fuel', 'fuelTypeName', 'fuelName', 'fuelDescription', 'fuelTypeDescription']), null)) || null
  const colour = clean(first(field(vehicle, ['colour', 'color', 'exteriorColour', 'exteriorColor', 'colourName', 'colorName', 'exteriorColourName']), null)) || null
  const engineSize = clean(first(field(vehicle, ['engineSize', 'engine', 'engineCapacity', 'engineCC', 'capacity', 'engineDescription']), null)) || null
  const description = clean(first(field(vehicle, ['description', 'comments', 'overview', 'title', 'name'], [year, make, model, variant].filter(Boolean).join(' ')))) || null
  const features = [...new Set([...asArray(field(vehicle, ['features', 'optionalExtras', 'equipment', 'extras'])), ...valuesByName(vehicle, ['feature', 'extra'])].flatMap(asArray).map(clean).filter(Boolean))]
  const healthCheck = field(vehicle, ['healthCheck', 'vehicleHealthCheck', 'healthCheckStatus'], null)
  const identity = stockNumber || sourceUrl || `${year}-${make}-${model}`
  const slug = clean(`${year ?? ''}-${make}-${model}-${variant ?? ''}-${identity}`).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const vehicleName = clean(first(field(vehicle, ['vehicleName', 'displayName', 'fullName', 'title', 'description']), [year, make, model, variant].filter(Boolean).join(' '))) || model

  return {
    vehicle_name: vehicleName,
    stock_number: stockNumber, slug, make, model, variant, year, mileage, price, monthly_payment: monthlyPayment,
    body_type: bodyType, transmission, fuel_type: fuelType, colour, engine_size: engineSize, power_kw: powerKw,
    description, overview: clean(first(field(vehicle, ['overview']), description)) || null,
    features, health_check: healthCheck, image_url: uniqueImages[0] ?? null, gallery_urls: uniqueImages,
    status: 'available', featured: false, source_url: sourceUrl, source_updated_at: new Date().toISOString(),
  }
}

export function getVehicleDiagnostic(vehicle) {
  return diagnosticKeys(vehicle)
}

export { DEALER_ID, PAGE_SIZE, API_URL, MIN_SYNC_ROWS }
