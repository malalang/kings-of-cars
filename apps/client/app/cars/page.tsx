import Link from 'next/link'
import { Gauge, Heart, Fuel, Search, Settings2, Palette } from 'lucide-react'
import type { Metadata } from 'next'
import { getVehicles } from '../../lib/vehicles'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Quality Used Cars | Boksburg | King of Cars',
  description:
    'Looking for a quality used car? We have a range of used models that are affordably priced and come with peace of mind. Call us for quality pre-owned cars.',
}

const money = (value: number | null) =>
  value == null
    ? 'POA'
    : new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value)

const priceSteps = [25000, 50000, 75000, 100000, 150000, 200000, 300000, 400000, 500000, 700000, 1000000]

type CarSearchParams = {
  q?: string
  make?: string
  model?: string
  priceFrom?: string
  priceTo?: string
  mileage?: string
  transmission?: string
  fuel?: string
  year?: string
  sort?: string
  onlyPhotos?: string
}

export default async function CarsPage({ searchParams }: { searchParams: Promise<CarSearchParams> }) {
  const params = await searchParams
  const vehicles: any[] = await getVehicles()

  const makes = [...new Set(vehicles.map((c) => c.make).filter(Boolean))].sort()
  const models = [...new Set(vehicles.map((c) => c.model).filter(Boolean))].sort()
  const transmissions = [...new Set(vehicles.map((c) => c.transmission).filter(Boolean))].sort()
  const fuels = [...new Set(vehicles.map((c) => c.fuel_type).filter(Boolean))].sort()
  const years = [...new Set(vehicles.map((c) => String(c.year)).filter(Boolean))].sort().reverse()

  const q = (params.q || '').trim().toLowerCase()
  const make = params.make || ''
  const model = params.model || ''
  const priceFrom = params.priceFrom ? Number(params.priceFrom) : null
  const priceTo = params.priceTo ? Number(params.priceTo) : null
  const mileage = params.mileage || ''
  const transmission = params.transmission || ''
  const fuel = params.fuel || ''
  const year = params.year || ''
  const onlyPhotos = params.onlyPhotos === '1'
  const sort = params.sort || 'featured'

  const filtered = vehicles
    .filter((car) => {
      if (q) {
        const hay = `${car.make} ${car.model} ${car.variant} ${car.colour} ${car.body_type}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (make && car.make !== make) return false
      if (model && car.model !== model) return false
      if (priceFrom != null && (car.price == null || car.price < priceFrom)) return false
      if (priceTo != null && (car.price == null || car.price > priceTo)) return false
      if (transmission && car.transmission !== transmission) return false
      if (fuel && car.fuel_type !== fuel) return false
      if (year && String(car.year) !== year) return false
      if (mileage) {
        const [low, high] = mileage.split('-').map(Number)
        if (car.mileage == null) return false
        if (low != null && car.mileage < low) return false
        if (high != null && car.mileage > high) return false
      }
      if (onlyPhotos && !car.image_url) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return (a.price ?? Infinity) - (b.price ?? Infinity)
      if (sort === 'price-desc') return (b.price ?? -Infinity) - (a.price ?? -Infinity)
      if (sort === 'mileage-asc') return (a.mileage ?? Infinity) - (b.mileage ?? Infinity)
      if (sort === 'year-desc') return (b.year ?? 0) - (a.year ?? 0)
      return 0
    })

  return (
    <div className="inner py-5 container-fluid">
      <div className="title left mb-5">
        <h1>Trichardts Road, Boksburg Used Cars</h1>
        <div className="divider" />
      </div>
      <p>
        Our branch in Trichardts Road, Boksburg has a range of quality cars that are affordable and
        guaranteed to suit your budget. Our pre-owned cars have been taken through rigorous road tests
        to ensure that you are guaranteed quality and peace of mind when you purchase a vehicle from
        King of Cars.
      </p>
      <p>
        Should we not have the car that you are looking for in stock,{' '}
        <a href="/contact-trichardts-road" title="Contact Us">
          contact us
        </a>{' '}
        and we will source the car of your dreams. We have financial solutions to assist you in the
        purchase of your vehicle. With us, you are guaranteed our promise of integrity to ensure that
        your relationship with us is for a lifetime.
      </p>
      <br />

      {/* VehicleStockSearchNew BarTile - copied structure, wired to Supabase */}
      <form method="get" id="vehicle_search_area_used">
        <div className="row m-0" id="vehicle-search-container">
          {/* LEFT: filters */}
          <div className="col-lg-3 col-md-3 col-12">
            <div className="mb-2">
              <label className="col-form-label m-xl-0 p-xl-0 mt-2 mt-md-n4 mt-sm-n3 d-inline-block align-self-center font-weight-bold">
                Search our vehicles in stock
              </label>
            </div>
            <div className="d-flex pt-2 pt-sm-1 pt-md-0 mb-2" style={{ position: 'relative' as const }}>
              <div className="w-75 pt-md-1 pt-sm-1 pt-xl-0" id="DepartmentFilterButtons" />
              <Link href="/cars" className="align-self-center small">
                <u>Clear Filter</u>
              </Link>
            </div>

            <div className="input-group mb-3 koc-search-group">
              <input
                type="text"
                id="keywordSearch"
                name="q"
                defaultValue={params.q ?? ''}
                className="form-control"
                placeholder="Search (EG. white demo 4x4)"
              />
              <div className="input-group-append">
                <button type="submit" className="input-group-text" id="basic-addon1" aria-label="Search">
                  <Search size={14} />
                </button>
              </div>
            </div>

            <div className="koc-filter-stack">
              <div className="button-group border-bottom">
                <label className="koc-filter-label">Makes</label>
                <select name="make" defaultValue={make} className="koc-filter-select">
                  <option value="">All Makes</option>
                  {makes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="button-group border-bottom">
                <label className="koc-filter-label">Models</label>
                <select name="model" defaultValue={model} className="koc-filter-select">
                  <option value="">All Models</option>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="button-group border-bottom">
                <label className="koc-filter-label">Year</label>
                <select name="year" defaultValue={year} className="koc-filter-select">
                  <option value="">Any Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="button-group border-bottom">
                <label className="koc-filter-label">Mileage</label>
                <select name="mileage" defaultValue={mileage} className="koc-filter-select">
                  <option value="">Any Mileage</option>
                  <option value="0-50000">0 - 50 000 Km</option>
                  <option value="50000-100000">50 000 - 100 000 Km</option>
                  <option value="100000-200000">100 000 - 200 000 Km</option>
                  <option value="200000-9999999">200 000+ Km</option>
                </select>
              </div>

              <div className="button-group border-bottom">
                <label className="koc-filter-label">Price</label>
                <select name="priceFrom" defaultValue={params.priceFrom ?? ''} className="koc-filter-select">
                  <option value="">Price From</option>
                  {priceSteps.map((s) => (
                    <option key={s} value={String(s)}>
                      {money(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-group border-bottom">
                <label className="koc-filter-label" style={{ opacity: 0 }}>
                  Price To
                </label>
                <select name="priceTo" defaultValue={params.priceTo ?? ''} className="koc-filter-select">
                  <option value="">Price To</option>
                  {priceSteps.map((s) => (
                    <option key={s} value={String(s)}>
                      {money(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="button-group border-bottom">
                <label className="koc-filter-label">Transmission</label>
                <select name="transmission" defaultValue={transmission} className="koc-filter-select">
                  <option value="">Any</option>
                  {transmissions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="button-group border-bottom mb-1">
                <label className="koc-filter-label">Fuel Type</label>
                <select name="fuel" defaultValue={fuel} className="koc-filter-select">
                  <option value="">Any</option>
                  {fuels.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="ShowOnlyWithPhotos"
                  name="onlyPhotos"
                  value="1"
                  defaultChecked={onlyPhotos}
                />
                <label className="form-check-label" htmlFor="ShowOnlyWithPhotos">
                  Only show vehicles with photos
                </label>
              </div>

              <div className="koc-filter-actions">
                <button type="submit" className="koc-vs-search w-100">
                  <Search size={14} /> Search
                </button>
                <Link href="/cars" className="koc-filter-clear">
                  <u>Clear Filter</u>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: results */}
          <div className="col-md-9 col-12">
            <div id="topOfVehicleList" />
            <div className="SearchStats koc-search-stats">
              Showing <strong>{filtered.length}</strong> of {vehicles.length} vehicles
              {q && (
                <>
                  {' '}
                  for &quot;<strong>{params.q}</strong>&quot;
                </>
              )}
              {make && (
                <>
                  {' '}
                  — <strong>{make}</strong>
                </>
              )}
            </div>

            <div className="ml-auto mr-3 float-right d-flex align-items-center gap-2 koc-sort-row">
              <div className="btn-group">
                <select name="sort" defaultValue={sort} className="btn btn-secondary btn-sm vs-sort-button text-capitalize">
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="mileage-asc">Mileage: Lowest</option>
                  <option value="year-desc">Year: Newest</option>
                </select>
              </div>
            </div>

            <div id="widget-vehicle-search-used" className="koc-widget-results">
              {filtered.length === 0 ? (
                <div className="koc-vs-empty">
                  <p>
                    No vehicles match your search criteria. Adjust the filters or{' '}
                    <Link href="/contact-trichardts-road">contact us</Link> — we will source the car for you.
                  </p>
                  <Link href="/cars" className="vs-result-more-button btn btn-outline-dark btn-sm">
                    Clear Filters
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {filtered.map((car) => (
                    <div key={car.id} className="col-12 col-md-12 col-lg-6 col-xl-4 p-0 card vs-list-tile mt-3">
                      <div className="card-body p-2" data-vehicle-clientID={car.id}>
                        <div className="row no-gutters">
                          <div className="col-12 mw-100" id={`vs-list-gallery-${car.id}`}>
                            <div className="koc-tile-media">
                              {car.image_url ? (
                                <img
                                  src={car.image_url}
                                  alt={`${car.year ?? ''} ${car.make} ${car.model}`.trim()}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="imagePlaceHolder fa-10x text-center">
                                  <Heart size={28} />
                                  <span>No vehicle image</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-12 d-flex flex-column">
                            <div className="row no-gutters pl-2 my-1">
                              <span className="vs-list-year text-primary p-0 mr-1">{car.year ?? '—'}</span>
                              <span className="vs-list-name btn-sm p-0">
                                {car.make} {car.model} {car.variant ? ` ${car.variant}` : ''}
                              </span>
                            </div>
                            <div className="row no-gutters pl-2 align-items-baseline">
                              <div className="col-7">
                                <div className="vs-list-price text-primary font-weight-bold" style={{ fontSize: 'large' }}>
                                  {money(car.price)}
                                </div>
                              </div>
                              <div className="col-5 pr-0 text-right">
                                <span className="vs-list-mileage small text-muted">{car.body_type ?? ''}</span>
                              </div>
                            </div>
                            <div className="ml-3 mr-3 mt-3" style={{ borderBottom: '1px inset #e9ecef' }} />
                            <div className="row no-gutters pl-2 mt-md-3">
                              {car.mileage != null && (
                                <div className="col-6 vs-list-mileage" style={{ fontSize: '0.9rem' }}>
                                  <Gauge size={13} className="mr-1" />
                                  {car.mileage.toLocaleString('en-ZA')} Km
                                </div>
                              )}
                              {car.colour && (
                                <div className="col-6 vs-list-colour" style={{ fontSize: '0.9rem' }}>
                                  <Palette size={13} className="mr-1" />
                                  {car.colour}
                                </div>
                              )}
                              {car.transmission && (
                                <div className="col-6 vs-list-transmission" style={{ fontSize: '0.9rem' }}>
                                  <Settings2 size={13} className="mr-1" />
                                  {car.transmission}
                                </div>
                              )}
                              {car.fuel_type && (
                                <div className="col-6 vs-list-fuel" style={{ fontSize: '0.9rem' }}>
                                  <Fuel size={13} className="mr-1" />
                                  {car.fuel_type}
                                </div>
                              )}
                            </div>
                            <div className="align-items-end d-flex flex-fill no-gutters ShowButtonsAtTop row mt-2">
                              <div className="col-12">
                                <div className="row px-1 mx-0 col-12">
                                  <div className="col-6 px-0">
                                    <Link
                                      href={`/cars/${car.slug}`}
                                      className="vs-result-more-button btn btn-outline-dark btn-block btn-sm"
                                      style={{ width: '98%' }}
                                    >
                                      More Info
                                    </Link>
                                  </div>
                                  <div className="col-6 px-0">
                                    <Link
                                      href={`/cars/${car.slug}`}
                                      className="btn btn-primary w-100 btn-sm"
                                      style={{ width: '98%' }}
                                    >
                                      Enquire
                                    </Link>
                                  </div>
                                  <div className="col-6 px-0 mt-1">
                                    <div
                                      className="btn btn-secondary btn-block btn-sm"
                                      style={{
                                        cursor: 'pointer',
                                        width: '98%',
                                        display: 'block',
                                        margin: '0 auto',
                                        padding: '2.5px 10px',
                                      }}
                                    >
                                      <div className="align-items-center row">
                                        <div className="pr-0 col-1" style={{ fontSize: '1rem' }}>
                                          <span className="fa-stack" style={{ height: '1rem', lineHeight: '1rem', fontSize: '60%' }}>
                                            <Heart size={12} />
                                          </span>
                                        </div>
                                        <div className="col-10 pl-sm-2 p-0" style={{ fontSize: '0.75rem' }}>
                                          Compare
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {car.price != null && (
                                    <div className="col-6 px-0 mt-1">
                                      <Link
                                        href={`/finance?price=${car.price}&vehicle=${car.slug}`}
                                        className="btn btn-secondary btn-block btn-sm"
                                        style={{ width: '98%' }}
                                      >
                                        Finance
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="SearchStats" />
          </div>
        </div>
      </form>
    </div>
  )
}
