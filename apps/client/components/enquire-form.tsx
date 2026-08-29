'use client'

import { FormEvent, useState } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Props = { vehicleId: string; vehicleTitle: string }

export function EnquireForm({ vehicleId, vehicleTitle }: Props) {
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const { error: insertError } = await supabase.from('KingsOfCars_leads').insert({
      vehicle_id: vehicleId,
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim() || null,
      phone: String(form.get('phone') ?? '').trim() || null,
      message: String(form.get('message') ?? '').trim() || null,
      source: 'website',
      status: 'new',
    })
    setBusy(false)
    if (insertError) { setError(insertError.message); return }
    setSent(true)
    event.currentTarget.reset()
  }

  if (sent) return <div className="koc-enquire-success"><CheckCircle2 size={28}/><h3>Thank you</h3><p>Your enquiry has been received. The Kings of Cars team will contact you shortly.</p></div>

  return <form className="koc-enquire-form" onSubmit={submit}>
    <div className="koc-kicker">Get in touch</div>
    <h2 className="koc-display">Enquire about this vehicle</h2>
    <p className="koc-enquire-vehicle">{vehicleTitle}</p>
    <label>Name<input name="name" required minLength={2} maxLength={120} autoComplete="name" /></label>
    <div className="koc-enquire-grid"><label>Email<input name="email" type="email" maxLength={320} autoComplete="email" /></label><label>Phone<input name="phone" type="tel" maxLength={40} autoComplete="tel" /></label></div>
    <label>Message<textarea name="message" rows={5} maxLength={5000} defaultValue={`I am interested in the ${vehicleTitle}.`} /></label>
    {error && <p className="koc-enquire-error" role="alert">{error}</p>}
    <button className="koc-button koc-button-primary" type="submit" disabled={busy}>{busy ? <Loader2 size={16} className="koc-spin"/> : <Send size={16}/>} {busy ? 'Sending…' : 'Send enquiry'}</button>
  </form>
}
