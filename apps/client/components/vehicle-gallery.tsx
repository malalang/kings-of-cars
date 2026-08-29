'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

type VehicleGalleryProps = {
  images?: string[] | null
  fallback?: string | null
  alt: string
  variant?: 'basic' | 'square' | 'full'
}

export function VehicleGallery({ images, fallback, alt, variant = 'basic' }: VehicleGalleryProps) {
  const gallery = Array.from(new Set([...(images ?? []), ...(fallback ? [fallback] : [])].filter((url): url is string => typeof url === 'string' && url.trim().length > 0)))
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (gallery.length > 1 && event.key === 'ArrowLeft') setIndex((value) => (value - 1 + gallery.length) % gallery.length)
      if (gallery.length > 1 && event.key === 'ArrowRight') setIndex((value) => (value + 1) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey) }
  }, [open, gallery.length])

  if (!gallery.length) return <div className="koc-legacy-gallery"><div className="koc-legacy-no-image"><span>No image available</span></div></div>

  const current = gallery[index] ?? gallery[0]
  const previous = () => setIndex((value) => (value - 1 + gallery.length) % gallery.length)
  const next = () => setIndex((value) => (value + 1) % gallery.length)

  return <>
    {variant === 'full' ? (
      <div className="koc-detail-gallery-grid">
        {gallery.map((image, imageIndex) => (
          <button key={`${image}-${imageIndex}`} type="button" className={`koc-detail-gallery-tile${imageIndex === 0 ? ' featured' : ''}`} onClick={() => { setIndex(imageIndex); setOpen(true) }} aria-label={`Open image ${imageIndex + 1} of ${gallery.length}`}>
            <img src={image} alt={`${alt} — image ${imageIndex + 1}`} loading={imageIndex < 4 ? 'eager' : 'lazy'} />
            <span className="koc-detail-gallery-tile-overlay"><Maximize2 size={18} /><span>{imageIndex + 1}</span></span>
          </button>
        ))}
      </div>
    ) : (
      <button type="button" className={`koc-gallery-click-target${variant === 'square' ? ' koc-gallery-square' : ''}`} onClick={() => setOpen(true)} aria-label={`Open full gallery for ${alt}`}>
        <div className="koc-legacy-gallery">
          <img src={current} alt={alt} loading="eager" />
          <div className="koc-legacy-gallery-shade" aria-hidden="true" />
          <span className="koc-legacy-gallery-count">{gallery.length} {gallery.length === 1 ? 'IMAGE' : 'IMAGES'}</span>
        </div>
      </button>
    )}

    {open && <div className="koc-gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${alt} photo gallery`} onClick={() => setOpen(false)}>
      <button type="button" className="koc-gallery-lightbox-close" onClick={() => setOpen(false)} aria-label="Close gallery"><X size={24} /></button>
      <div className="koc-gallery-lightbox-content" onClick={(event) => event.stopPropagation()}>
        <img src={current} alt={`${alt} — image ${index + 1} of ${gallery.length}`} loading="eager" />
        {gallery.length > 1 && <>
          <button type="button" className="koc-legacy-gallery-nav prev" onClick={previous} aria-label="Previous vehicle image"><ChevronLeft size={30} /></button>
          <button type="button" className="koc-legacy-gallery-nav next" onClick={next} aria-label="Next vehicle image"><ChevronRight size={30} /></button>
        </>}
        <span className="koc-gallery-lightbox-counter">{index + 1} / {gallery.length}</span>
      </div>
    </div>}
  </>
}
