import Link from 'next/link'
import { ArrowRight, Gauge, Fuel, Settings2 } from 'lucide-react'
import { getVehicles } from '../../lib/vehicles'

export const revalidate = 60

const money = (value: number | null) => value == null ? 'POA' : new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value)

export default async function CarsPage() {
  const vehicles = await getVehicles()
  return <main className="koc-shell">
    <section style={{background:'#111',color:'#fff',padding:'92px 0'}}><div className="koc-container"><div className="koc-kicker" style={{color:'#e33a48'}}>King of Cars showroom</div><h1 className="koc-display" style={{fontSize:'clamp(48px,7vw,88px)',marginTop:14}}>Find your<br/><span style={{color:'#e33a48'}}>next car.</span></h1><p style={{maxWidth:650,marginTop:20,color:'rgba(255,255,255,.65)',lineHeight:1.7}}>Browse the live King of Cars inventory. Vehicle availability, pricing and core specifications are read directly from Supabase.</p></div></section>
    <section style={{padding:'64px 0'}}><div className="koc-container"><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:20,marginBottom:28}}><div><div className="koc-kicker">Live inventory</div><h2 className="koc-display" style={{fontSize:'clamp(34px,5vw,58px)',marginTop:8}}>{vehicles.length} vehicles available</h2></div><Link href="/contact" className="koc-button koc-button-primary">Need help choosing? <ArrowRight size={15}/></Link></div>
      {vehicles.length === 0 ? <div className="koc-card" style={{padding:32}}>No vehicles are published yet. The showroom is connected and ready for inventory.</div> : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:18}}>{vehicles.map((car:any)=><Link key={car.id} href={`/cars/${car.slug}`} className="koc-card" style={{overflow:'hidden'}}><div style={{aspectRatio:'4/3',background:'#e9e9e9',overflow:'hidden'}}>{car.image_url ? <img src={car.image_url} alt={`${car.year ?? ''} ${car.make} ${car.model}`} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{height:'100%',display:'grid',placeItems:'center',color:'#777',fontSize:12}}>No vehicle image</div>}</div><div style={{padding:20}}><div style={{fontSize:10,fontWeight:900,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--koc-red)'}}>{car.year ?? '—'} · {car.body_type ?? 'Pre-owned'}</div><h3 style={{fontSize:20,fontWeight:900,marginTop:8}}>{car.make} {car.model}</h3>{car.variant && <div style={{color:'var(--koc-muted)',fontSize:13,marginTop:4}}>{car.variant}</div>}<div style={{fontSize:22,fontWeight:900,marginTop:18}}>{money(car.price)}</div><div style={{display:'flex',flexWrap:'wrap',gap:12,color:'var(--koc-muted)',fontSize:11,marginTop:14}}>{car.mileage != null && <span><Gauge size={13} style={{verticalAlign:'-2px'}}/> {car.mileage.toLocaleString()} km</span>}{car.transmission && <span><Settings2 size={13} style={{verticalAlign:'-2px'}}/> {car.transmission}</span>}{car.fuel_type && <span><Fuel size={13} style={{verticalAlign:'-2px'}}/> {car.fuel_type}</span>}</div></div></Link>)}</div>}</div></section>
  </main>
}
