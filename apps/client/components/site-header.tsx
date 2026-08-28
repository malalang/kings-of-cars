'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'

const nav = [
  { label: 'Home', href: '/' },
  { label: 'BUY A CAR', href: '/cars' },
  { label: 'Finance Solution', href: '/finance' },
  { label: 'Finance Calculator', href: '/finance' },
  { label: 'About Us', href: '/about' },
  { label: 'SELL A CAR', href: '/sell-your-car' },
  { label: 'Contact Us', href: '/contact' },
]

const phones = ['010 823 9006', '010 492 6780', '011 594 2556', '011 918 9210']

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="koc-site-header koc-legacy-header">
      <div className="koc-header-top">
        <div className="koc-container koc-header-top-inner">
          <div className="koc-legacy-top-left">
            <Link href="/">King of Cars</Link>
            <Link href="/cars" className="koc-wishlist"><Heart size={12} fill="currentColor" /> Wishlist</Link>
          </div>
          <div className="koc-legacy-top-phones">
            {phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}><Phone size={9} /> {phone}</a>)}
          </div>
        </div>
      </div>

      <div className="koc-header-main">
        <div className="koc-container koc-header-main-inner">
          <Link href="/" className="koc-brand" aria-label="King of Cars home">
            <Image src="/logo.png" alt="King of Cars" width={180} height={64} priority className="koc-logo" />
          </Link>
          <nav className="koc-desktop-nav" aria-label="Main navigation">
            {nav.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
          </nav>
          <button className="koc-menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="koc-mobile-nav" aria-label="Mobile navigation">
          {nav.map((item) => <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <Link href="/cars" onClick={() => setOpen(false)}><Heart size={14} /> Wishlist</Link>
        </nav>
      )}
    </header>
  )
}
