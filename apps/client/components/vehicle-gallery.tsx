'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

type VehicleGalleryProps = { images?: string[] | null; fallback?: string | null; alt: string }

export function VehicleGallery({ images, fallback, alt }: VehicleGalleryProps) {
  const gallery = Array.from(new Set([...(images ?? []), ...(fallback ? [fallback] : [])].filter((url): url is string => typeof url === 'string' && url.trim().length > 0)))
  const [index, setIndex] = useState(0)

  if (!gallery.length) return <div className="koc-legacy-gallery"><div className="koc-legacy-no-image"><span>No image available</span></div></div>

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
      <style jsx>{`
        .koc-legacy-gallery-shade{position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(0,0,0,.5),transparent 42%);pointer-events:none}
        .koc-legacy-gallery-nav{position:absolute;top:50%;z-index:6;transform:translateY(-50%);width:32px;height:40px;border:1px solid rgba(255,255,255,.75);background:rgba(35,35,35,.72);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:background .2s,opacity .2s}
        .koc-legacy-gallery-nav:hover{background:rgba(114,10,6,.94)}
        .koc-legacy-gallery-nav.prev{left:8px}.koc-legacy-gallery-nav.next{right:8px}
        .koc-legacy-gallery-meta{position:absolute;left:8px;right:8px;bottom:8px;z-index:7;display:flex;align-items:center;gap:6px;pointer-events:none}
        .koc-legacy-gallery-badge,.koc-legacy-gallery-counter,.koc-legacy-gallery-action{height:27px;display:flex;align-items:center;justify-content:center;background:rgba(35,35,35,.8);color:#fff;border:1px solid rgba(255,255,255,.25);font-size:8px;font-weight:700;letter-spacing:.08em}
        .koc-legacy-gallery-badge{padding:0 8px}.koc-legacy-gallery-counter{padding:0 8px;margin-left:auto;font-variant-numeric:tabular-nums}.koc-legacy-gallery-action{width:27px}
        .koc-legacy-gallery-thumbs{position:absolute;left:8px;right:8px;bottom:42px;z-index:8;display:flex;gap:4px;overflow:hidden;pointer-events:auto}
        .koc-legacy-gallery-thumbs button{flex:0 0 38px;width:38px;height:28px;padding:0;border:1px solid rgba(255,255,255,.6);background:#333;cursor:pointer;opacity:.72;overflow:hidden}
        .koc-legacy-gallery-thumbs button.active{border:2px solid #fff;opacity:1}.koc-legacy-gallery-thumbs button:hover{opacity:1}
        .koc-legacy-gallery-thumbs img{width:100%;height:100%;min-height:0;object-fit:cover;display:block;transform:none!important;filter:none!important}
        @media(max-width:560px){.koc-legacy-gallery-nav{width:36px;height:44px}.koc-legacy-gallery-thumbs button{flex-basis:44px;width:44px;height:32px}}
      `}</style>
    </div>
  )
}
