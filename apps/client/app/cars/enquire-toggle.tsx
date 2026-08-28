'use client'

import { useState } from 'react'

export function EnquireToggle({ vehicle }: { vehicle: { id?: string; year?: number | string | null; make?: string | null; model?: string | null; variant?: string | null; price?: number | null } }) {
  const [open, setOpen] = useState(false)
  const vehicleName = [vehicle.year, vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(' ')

  return <>
    <button type="button" className="enquire" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
      Enquire
    </button>
    {open ? <div className="koc-enquire-panel">
      <div className="koc-enquire-heading">
        <div><strong>Enquire about this vehicle</strong><span>{vehicleName}</span></div>
        <button type="button" className="koc-enquire-close" onClick={() => setOpen(false)} aria-label="Close enquiry form">×</button>
      </div>
      <form className="koc-enquire-form" onSubmit={(event) => event.preventDefault()}>
        <input type="hidden" name="vehicle_id" value={vehicle.id || ''} />
        <input type="hidden" name="vehicle" value={vehicleName} />
        <label><span>Name</span><input name="name" required placeholder="Your name" /></label>
        <label><span>Email</span><input type="email" name="email" required placeholder="Your email address" /></label>
        <label><span>Phone</span><input name="phone" required placeholder="Your phone number" /></label>
        <label><span>Message</span><textarea name="message" rows={3} defaultValue={`I am interested in the ${vehicleName}${vehicle.price != null ? ` priced at R ${Math.round(vehicle.price).toLocaleString('en-ZA')}` : ''}.`} /></label>
        <button type="submit" className="koc-enquire-submit">SEND ENQUIRY</button>
      </form>
    </div> : null}
  </>
}
