import Link from 'next/link'
import { Gauge, Heart, Fuel, Search, Settings2 } from 'lucide-react'
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

const priceSteps = [25000, 50000, 75000, 100000, 150000, 200000, 300000, 400000, 500000]

type CarSearchParams = {
  make?: string
  priceFrom?: string
  priceTo?: string
  sort?: string
}

export default async function CarsPage({ searchParams }: { searchParams: Promise<CarSearchParams> }) {
  const params = await searchParams
  const vehicles: any[] = await getVehicles()

  const makes = [...new Set(vehicles.map((car) => car.make).filter(Boolean))].sort()

  const make = params.make || ''
  const priceFrom = params.priceFrom ? Number(params.priceFrom) : null
  const priceTo = params.priceTo ? Number(params.priceTo) : null
  const sort = params.sort || 'featured'

  const filtered = vehicles
    .filter((car) => {
      if (make && car.make !== make) return false
      if (priceFrom != null && (car.price == null || car.price < priceFrom)) return false
      if (priceTo != null && (car.price == null || car.price > priceTo)) return false
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
    <main className="koc-cars">
      <div className="koc-container">
        <div className="koc-page-head">
          <h1>Trichardts Road, Boksburg Used Cars</h1>
          <div className="koc-divider koc-divider-left" />
        </div>
        <p className="koc-page-copy">
          Our branch in Trichardts Road, Boksburg has a range of quality cars that are affordable and
          guaranteed to suit your budget. Our pre-owned cars have been taken through rigorous road tests
          to ensure that you are guaranteed quality and peace of mind when you purchase a vehicle from
          King of Cars.
        </p>
        <p className="koc-page-copy">
          Should we not have the car that you are looking for in stock, <Link href="/contact">contact us</Link> and
          we will source the car of your dreams. We have financial solutions to assist you in the purchase
          of your vehicle. With us, you are guaranteed our promise of integrity to ensure that your
          relationship with us is for a lifetime.
        </p>

        <form method="get" className="koc-vs-bar">
          <div className="koc-vs-field">
            <label htmlFor="vs-make">Make</label>
            <select id="vs-make" name="make" defaultValue={make}>
              <option value="">All Makes</option>
              {makes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="koc-vs-field">
            <label htmlFor="vs-price-from">Price From</label>
            <select id="vs-price-from" name="priceFrom" defaultValue={params.priceFrom ?? ''}>
              <option value="">Any</option>
              {priceSteps.map((step) => (
                <option key={step} value={step}>{money(step)}</option>
              ))}
            </select>
          </div>
          <div className="koc-vs-field">
            <label htmlFor="vs-price-to">Price To</label>
            <select id="vs-price-to" name="priceTo" defaultValue={params.priceTo ?? ''}>
              <option value="">Any</option>
              {priceSteps.map((step) => (
                <option key={step} value={step}>{money(step)}</option>
              ))}
            </select>
          </div>
          <div className="koc-vs-field">
            <label htmlFor="vs-sort">Sort By</label>
            <select id="vs-sort" name="sort" defaultValue={sort}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="mileage-asc">Mileage: Lowest First</option>
              <option value="year-desc">Year: Newest</option>
            </select>
          </div>
          <button type="submit" className="koc-vs-search">
            <Search size={14} /> Search
          </button>
          <Link href="/cars" className="koc-vs-reset">Reset</Link>
        </form>

        <div className="koc-vs-count">
          Showing <strong>{filtered.length}</strong> of {vehicles.length} vehicles
        </div>

        {filtered.length === 0 ? (
          <div className="koc-vs-empty">
            <p>No vehicles match your search criteria. Adjust the filters or contact us &mdash; we will source the car for you.</p>
            <Link href="/cars" className="koc-vs-card-btn">Clear Filters</Link>
          </div>
        ) : (
          <div className="koc-vs-grid">
            {filtered.map((car) => (
              <Link key={car.id} href={`/cars/${car.slug}`} className="koc-vs-card">
                <div className="koc-vs-card-img">
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={`${car.year ?? ''} ${car.make} ${car.model}`.trim()}
                      loading="lazy"
                    />
                  ) : (
                    <span className="koc-vs-card-noimg">No vehicle image</span>
                  )}
                  <span className="koc-vs-card-heart" aria-hidden="true"><Heart size={14} /></span>
                  {car.price != null && <span className="koc-vs-card-tag">{money(car.price)}</span>}
                </div>
                <div className="koc-vs-card-head">
                  <span>{car.year ?? 'Pre-owned'}</span>
                  <h3>{car.make} {car.model}</h3>
                  {car.variant && <p>{car.variant}</p>}
                </div>
                <div className="koc-vs-card-specs">
                  {car.mileage != null && (
                    <span><Gauge size={13} /> {car.mileage.toLocaleString('en-ZA')} km</span>
                  )}
                  {car.transmission && <span><Settings2 size={13} /> {car.transmission}</span>}
                  {car.fuel_type && <span><Fuel size={13} /> {car.fuel_type}</span>}
                </div>
                <span className="koc-vs-card-btn">View Vehicle</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
