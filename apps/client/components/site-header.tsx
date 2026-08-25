'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Mail, Menu, Phone, X } from 'lucide-react'
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
          <div className="koc-header-contact">
            <a href="tel:+27119000000"><Phone size={13} /> 011 900 0000</a>
            <a href="mailto:info@kingofcars.co.za"><Mail size={13} /> info@kingofcars.co.za</a>
            <Link href="/cars" className="koc-wishlist"><Heart size={14} /> Wishlist</Link>
          </div>
        </div>
      </div>

      <div className="koc-header-main">
        <div className="koc-container koc-header-main-inner">
          <Link href="/" className="koc-brand" aria-label="King of Cars home">
            <Image src="/logo.png" alt="King of Cars" width={180} height={64} priority className="koc-logo" />
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
        <a href="tel:+27119000000" onClick={() => setOpen(false)}><Phone size={15} /> 011 900 0000</a>
        <a href="mailto:info@kingofcars.co.za" onClick={() => setOpen(false)}><Mail size={15} /> info@kingofcars.co.za</a>
        <Link href="/cars" onClick={() => setOpen(false)}><Heart size={15} /> Wishlist</Link>
      </nav>}
    </header>
  )
}
