'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { BUSINESS_INFO } from '@kings-of-cars/constants/Business_info'

const nav = [
  { label: 'Home', href: '/' },
  { label: 'BUY A CAR', href: '/cars' },
  { label: 'Finance Solution', href: '/finance' },
  { label: 'Finance Calculator', href: '/finance' },
  { label: 'About Us', href: '/about' },
  { label: 'SELL A CAR', href: '/sell-your-car' },
  { label: 'Contact Us', href: '/contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="koc-site-header koc-legacy-header">
      <div className="koc-header-top">
        <div className="koc-container koc-header-top-inner">
          <div className="koc-legacy-top-left">
            <Link href="/">{BUSINESS_INFO.brandName}</Link>
            <Link href="/cars" className="koc-wishlist"><Heart size={12} fill="currentColor" /> Wishlist</Link>
          </div>
          <div className="koc-legacy-top-phones">
            {BUSINESS_INFO.phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}><Phone size={9} /> {phone}</a>)}
          </div>
        </div>
      </div>

      <div className="koc-header-main">
        <div className="koc-container koc-header-main-inner">
          <Link href="/" className="koc-brand" aria-label={`${BUSINESS_INFO.brandName} home`}>
            <Image src="/logo.png" alt={BUSINESS_INFO.brandName} width={180} height={64} priority className="koc-logo" />
          </Link>
          <nav className="koc-desktop-nav" aria-label="Main navigation">
            {nav.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
          </nav>
          <a className="koc-header-whatsapp" href={`${BUSINESS_INFO.whatsapp.baseUrl}?text=${encodeURIComponent(BUSINESS_INFO.messages.general)}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with King of Cars on WhatsApp">
            WhatsApp
          </a>
          <button className="koc-menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="koc-mobile-nav" aria-label="Mobile navigation">
          {nav.map((item) => <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <a href={`${BUSINESS_INFO.whatsapp.baseUrl}?text=${encodeURIComponent(BUSINESS_INFO.messages.general)}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>WhatsApp</a>
          <Link href="/cars" onClick={() => setOpen(false)}><Heart size={14} /> Wishlist</Link>
        </nav>
      )}
    </header>
  )
}
