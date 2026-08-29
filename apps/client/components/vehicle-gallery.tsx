'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

type VehicleGalleryProps = {
  images?: string[] | null
  fallback?: string | null
  alt: string
}

export function VehicleGallery({ images, fallback, alt }: VehicleGalleryProps) {
  const gallery = Array.from(new Set([...(images ?? []), ...(fallback ? [fallback] : [])].filter((url): url is string => typeof url === 'string' && url.trim().length > 0)))
  const [index, setIndex] = useState(0)

  if (!gallery.length) {
    return <div className="koc-legacy-gallery"><div className="koc-legacy-no-image"><span>No image available</span></div></div>
  }

  const current = gallery[index] ?? gallery[0]
  const previous = () => setIndex((value) => (value - 1 + gallery.length) % gallery.length)
  const next = () => setIndex((value) => (value + 1) % gallery.length)

  return (
    <div className="koc-legacy-gallery" aria-label={`${alt} photo gallery`}>
      <img src={current} alt={`${alt} — photo ${index + 1} of ${gallery.length}`} loading="lazy" />
      <div className="koc-legacy-gallery-shade" aria-hidden="true" />
      {gallery.length > 1 && <>
        <button type="button" className="koc-legacy-gallery-nav prev" onClick={previous} aria-label="Previous vehicle photo"><ChevronLeft size={17} /></button>
        <button type="button" className="koc-legacy-gallery-nav next" onClick={next} aria-label="Next vehicle photo"><ChevronRight size={17} /></button>
      </>}
      <div className="koc-legacy-gallery-meta">
        <span className="koc-legacy-gallery-badge">{gallery.length} {gallery.length === 1 ? 'PHOTO' : 'PHOTOS'}</span>
        <span className="koc-legacy-gallery-counter">{index + 1} / {gallery.length}</span>
        <span className="koc-legacy-gallery-action" aria-hidden="true"><Maximize2 size={12} /></span>
      </div>
      {gallery.length > 1 && <div className="koc-legacy-gallery-thumbs" role="tablist" aria-label="Vehicle photos">
        {gallery.slice(0, 6).map((url, thumbIndex) => <button key={`${url}-${thumbIndex}`} type="button" role="tab" aria-selected={thumbIndex === index} className={thumbIndex === index ? 'active' : ''} onClick={() => setIndex(thumbIndex)} aria-label={`Show photo ${thumbIndex + 1}`}><img src={url} alt="" loading="lazy" /></button>)}
      </div>}
    </div>
  )
}
