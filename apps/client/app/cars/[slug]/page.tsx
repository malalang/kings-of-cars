import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Gauge, Fuel, Settings2, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react'
import { getVehicle } from '../../../lib/vehicles'
import { VehicleGallery } from '../../../components/vehicle-gallery'
import { EnquireForm } from '../../../components/enquire-form'

const money = (value: number | null) => value == null ? 'POA' : new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value)
export const revalidate = 60

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car: any = await getVehicle(slug)
  if (!car) notFound()
  const title = `${car.year ?? ''} ${car.make ?? ''} ${car.model ?? ''} ${car.variant ?? ''}`.replace(/\s+/g, ' ').trim()
  const gallery = Array.from(new Set([...(Array.isArray(car.gallery_urls) ? car.gallery_urls : []), ...(car.image_url ? [car.image_url] : [])]))
  const specs = [['Year', car.year, Gauge], ['Mileage', car.mileage != null ? `${Number(car.mileage).toLocaleString('en-ZA')} km` : '—', Gauge], ['Transmission', car.transmission || '—', Settings2], ['Fuel', car.fuel_type || '—', Fuel], ['Colour', car.colour || '—', null], ['Body type', car.body_type || '—', null]]

  return <main className="koc-shell">
    <section style={{background:'#111',color:'#fff',padding:'28px 0 64px'}}><div className="koc-container">
      <Link href="/cars" style={{display:'inline-flex',alignItems:'center',gap:8,color:'rgba(255,255,255,.65)',fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'.12em'}}>← Back to showroom</Link>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.2fr) minmax(300px,.8fr)',gap:36,marginTop:30,alignItems:'center'}}>
        <VehicleGallery images={gallery} alt={title}/>
        <div><div className="koc-kicker" style={{color:'#e33a48'}}>Vehicle details</div><h1 className="koc-display" style={{fontSize:'clamp(38px,5vw,70px)',marginTop:10}}>{car.make} {car.model}</h1>{car.variant && <p style={{color:'rgba(255,255,255,.62)',marginTop:8,fontSize:15}}>{car.variant}</p>}<div style={{fontSize:30,fontWeight:900,marginTop:22}}>{money(car.price)}</div><div style={{display:'flex',gap:8,alignItems:'center',marginTop:12,color:'rgba(255,255,255,.55)',fontSize:11}}><MapPin size={13}/> {car.location || 'Boksburg'}</div></div>
      </div>
    </div></section>

    <section style={{padding:'54px 0 70px'}}><div className="koc-container">
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10}}>{specs.map(([label,value,Icon])=><div className="koc-card" key={String(label)} style={{padding:20}}>{Icon ? <Icon size={17} color="var(--koc-red)"/> : null}<div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:900,color:'var(--koc-muted)',marginTop:Icon?10:0}}>{label}</div><div style={{fontWeight:900,marginTop:7}}>{value || '—'}</div></div>)}</div>
      <section style={{marginTop:64}}><div className="koc-kicker">Vehicle gallery</div><h2 className="koc-display" style={{fontSize:'clamp(34px,4vw,54px)',marginTop:8}}>Explore every angle</h2><div style={{marginTop:24}}><VehicleGallery images={gallery} alt={title}/></div></section>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.1fr) minmax(320px,.9fr)',gap:50,marginTop:70}}>
        <article><div className="koc-kicker">About this vehicle</div><h2 className="koc-display" style={{fontSize:'clamp(34px,4vw,54px)',marginTop:10}}>Vehicle overview</h2><p style={{color:'var(--koc-muted)',lineHeight:1.8,marginTop:18}}>{car.overview || car.description || 'A quality pre-owned vehicle selected for the King of Cars showroom.'}</p>{Array.isArray(car.features) && car.features.length > 0 && <><h3 style={{fontSize:24,fontWeight:900,marginTop:42}}>Features &amp; equipment</h3><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:10,marginTop:18}}>{car.features.map((feature:string)=><div key={feature} className="koc-card" style={{padding:14,fontSize:13,display:'flex',gap:8,alignItems:'center'}}><CheckCircle2 size={15} color="var(--koc-red)"/>{feature}</div>)}</div></>}</article>
        <div><EnquireForm vehicleId={car.id} vehicleTitle={title}/><aside className="koc-card" style={{padding:28,marginTop:18}}><ShieldCheck color="var(--koc-red)"/><h3 style={{fontSize:22,fontWeight:900,marginTop:16}}>Vehicle confidence</h3><p style={{color:'var(--koc-muted)',lineHeight:1.7,marginTop:10}}>Vehicle information is maintained from the dealership inventory source. Confirm final specification, availability and pricing before purchase.</p></aside></div>
      </div>
    </div></section>
  </main>
}