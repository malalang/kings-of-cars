import Link from 'next/link'
import { ArrowRight, CarFront, FileText, Handshake, LayoutDashboard } from 'lucide-react'

const areas = [
  ['Inventory', 'Manage vehicles, prices, mileage, specifications and media.', '/inventory', CarFront],
  ['Leads', 'Manage vehicle enquiries, finance leads and customer conversations.', '/leads', Handshake],
  ['Content', 'Manage articles, reviews, testimonials and dealership content.', '/content', FileText],
]

export default function AdminHome() {
  return <main className="admin-shell"><header className="admin-topbar"><div className="admin-brand">King <span>of</span> Cars · Admin</div><nav className="admin-nav"><Link href="/">Dashboard</Link><Link href="/inventory">Inventory</Link><Link href="/leads">Leads</Link></nav></header><div className="admin-main"><div><div style={{display:'inline-flex',alignItems:'center',gap:7,color:'var(--red)',fontSize:10,fontWeight:900,letterSpacing:'.14em',textTransform:'uppercase'}}><LayoutDashboard size={14}/> Operations</div><h1 className="page-title" style={{marginTop:12}}>King of Cars dashboard</h1><p className="page-copy">The operational foundation for vehicle inventory, customer leads and dealership content. Supabase will become the source of truth for every public record.</p></div><div className="admin-grid">{areas.map(([title,copy,href,Icon])=><section className="admin-card" key={title}><Icon size={24} color="var(--red)"/><h2 style={{marginTop:20}}>{title}</h2><p>{copy}</p><Link className="admin-link" href={href as string}>Open {title} <ArrowRight size={13}/></Link></section>)}</div></div></main>
}
