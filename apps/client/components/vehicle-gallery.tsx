'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

type VehicleGalleryProps = { images?: string[] | null; fallback?: string | null; alt: string }

export function VehicleGallery({ images, fallback, alt }: VehicleGalleryProps) {
  const gallery = Array.from(new Set([...(images ?? []), ...(fallback ? [fallback] : [])].filter((url): url is string => typeof url === 'string' && url.trim().length > 0)))
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key === 'ArrowLeft') setIndex((value) => (value - 1 + gallery.length) % gallery.length)
      if (event.key === 'ArrowRight') setIndex((value) => (value + 1) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey) }
  }, [open, gallery.length])

  if (!gallery.length) return <div className="koc-legacy-gallery"><div className="koc-legacy-no-image"><span>No image available</span></div></div>

  const current = gallery[index] ?? gallery[0]
  const previous = () => setIndex((value) => (value - 1 + gallery.length) % gallery.length)
  const next = () => setIndex((value) => (value + 1) % gallery.length)

  const content = (expanded = false) => (
    <div className={expanded ? 'koc-gallery-lightbox-stage' : 'koc-legacy-gallery'}>
      <img src={current} alt={`${alt} — photo ${index + 1} of ${gallery.length}`} loading={expanded ? 'eager' : 'lazy'} />
      <div className="koc-legacy-gallery-shade" aria-hidden="true" />
      {gallery.length > 1 && <>
        <button type="button" className="koc-legacy-gallery-nav prev" onClick={(event) => { event.stopPropagation(); previous() }} aria-label="Previous vehicle photo"><ChevronLeft size={expanded ? 28 : 17} /></button>
        <button type="button" className="koc-legacy-gallery-nav next" onClick={(event) => { event.stopPropagation(); next() }} aria-label="Next vehicle photo"><ChevronRight size={expanded ? 28 : 17} /></button>
      </>}
      <div className="koc-legacy-gallery-meta"><span className="koc-legacy-gallery-badge">{gallery.length} {gallery.length === 1 ? 'PHOTO' : 'PHOTOS'}</span><span className="koc-legacy-gallery-counter">{index + 1} / {gallery.length}</span></div>
      {!expanded && <button type="button" className="koc-legacy-gallery-open" onClick={(event) => { event.stopPropagation(); setOpen(true) }} aria-label="Open vehicle gallery"><Maximize2 size={14} /></button>}
      {gallery.length > 1 && <div className="koc-legacy-gallery-thumbs" role="tablist" aria-label="Vehicle photos">
        {gallery.slice(0, 8).map((url, thumbIndex) => <button key={`${url}-${thumbIndex}`} type="button" role="tab" aria-selected={thumbIndex === index} className={thumbIndex === index ? 'active' : ''} onClick={(event) => { event.stopPropagation(); setIndex(thumbIndex) }} aria-label={`Show photo ${thumbIndex + 1}`}><img src={url} alt="" loading="lazy" /></button>)}
      </div>}
    </div>
  )

  return <>
    <button type="button" className="koc-gallery-click-target" onClick={() => setOpen(true)} aria-label={`Open full gallery for ${alt}`}>{content()}</button>
    {open && <div className="koc-gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${alt} photo gallery`} onClick={() => setOpen(false)}>
      <button type="button" className="koc-gallery-lightbox-close" onClick={() => setOpen(false)} aria-label="Close gallery"><X size={24} /></button>
      <div className="koc-gallery-lightbox-content" onClick={(event) => event.stopPropagation()}>{content(true)}</div>
    </div>}
  </>
}
