'use client'

import Link from 'next/link'
import { Heart, Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'

const nav = [
  { label: 'Vehicles', href: '/cars' },
  { label: 'Sell Your Car', href: '/sell-your-car' },
  { label: 'Finance', href: '/finance' },
  { label: 'Value Added Products', href: '/value-added-products' },
  { label: 'Contact Us', href: '/contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="koc-site-header">
      <div className="koc-header-top">
        <div className="koc-container koc-header-top-inner">
          <div className="koc-branch-links">
            <Link href="/contact">Pre-Owned Trichardts Road</Link>
            <span aria-hidden="true">|</span>
            <a href="https://www.kingofcarspremium.co.za/" target="_blank" rel="noreferrer">Pre-Owned Premium</a>
          </div>
          <Link href="/cars" className="koc-wishlist"><Heart size={14} /> Wishlist</Link>
        </div>
      </div>

      <div className="koc-header-main">
        <div className="koc-container koc-header-main-inner">
          <Link href="/" className="koc-brand" aria-label="King of Cars home">
            <span>King</span><b>of</b><span>Cars</span>
          </Link>
          <nav className="koc-desktop-nav" aria-label="Main navigation">
            {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="koc-header-actions">
            <Link href="/contact" className="koc-header-phone"><Phone size={15} /> Contact</Link>
            <button className="koc-menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {open && <nav className="koc-mobile-nav" aria-label="Mobile navigation">
        {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        <Link href="/cars" onClick={() => setOpen(false)}><Heart size={15} /> Wishlist</Link>
      </nav>}
    </header>
  )
}
