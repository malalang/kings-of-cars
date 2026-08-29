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
  const openAt = (imageIndex: number) => { setIndex(imageIndex); setOpen(true) }

  return <>
    {variant === 'full' ? (
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gridAutoRows:'minmax(180px,18vw)',gap:10}}>
        {gallery.map((image, imageIndex) => (
          <button key={`${image}-${imageIndex}`} type="button" onClick={() => openAt(imageIndex)} aria-label={`Open image ${imageIndex + 1} of ${gallery.length}`} style={{position:'relative',display:'block',width:'100%',height:'100%',padding:0,border:0,overflow:'hidden',background:'#171717',cursor:'zoom-in',gridColumn:imageIndex === 0 ? 'span 2' : undefined,gridRow:imageIndex === 0 ? 'span 2' : undefined}}>
            <img src={image} alt={`${alt} — image ${imageIndex + 1}`} loading={imageIndex < 4 ? 'eager' : 'lazy'} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .45s'}} />
            <span style={{position:'absolute',inset:0,display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:14,background:'linear-gradient(transparent 55%,rgba(0,0,0,.72))',color:'#fff',opacity:.95}}><Maximize2 size={17}/><span style={{fontSize:11,fontWeight:900,letterSpacing:'.12em'}}>{imageIndex + 1}</span></span>
          </button>
        ))}
      </div>
    ) : (
      <button type="button" onClick={() => setOpen(true)} aria-label={`Open full gallery for ${alt}`} style={{display:'block',width:'100%',padding:0,border:0,background:'transparent',cursor:'zoom-in'}}>
        <div className="koc-legacy-gallery" style={variant === 'square' ? {aspectRatio:'1 / 1',height:'auto',minHeight:0} : undefined}>
          <img src={current} alt={alt} loading="eager" style={variant === 'square' ? {width:'100%',height:'100%',objectFit:'cover',display:'block'} : undefined} />
          <div className="koc-legacy-gallery-shade" aria-hidden="true" />
          <span className="koc-legacy-gallery-count">{gallery.length} {gallery.length === 1 ? 'IMAGE' : 'IMAGES'}</span>
        </div>
      </button>
    )}

    {open && <div role="dialog" aria-modal="true" aria-label={`${alt} photo gallery`} onClick={() => setOpen(false)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,.96)',display:'flex',alignItems:'center',justifyContent:'center',padding:'28px 60px'}}>
      <button type="button" onClick={() => setOpen(false)} aria-label="Close gallery" style={{position:'fixed',top:18,right:18,zIndex:3,width:46,height:46,display:'grid',placeItems:'center',border:'1px solid rgba(255,255,255,.25)',borderRadius:'50%',background:'rgba(0,0,0,.55)',color:'#fff',cursor:'pointer'}}><X size={24}/></button>
      <div onClick={(event) => event.stopPropagation()} style={{position:'relative',width:'min(92vw,1400px)',height:'min(88vh,900px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src={current} alt={`${alt} — image ${index + 1} of ${gallery.length}`} loading="eager" style={{maxWidth:'100%',maxHeight:'100%',width:'auto',height:'auto',objectFit:'contain',display:'block'}} />
        {gallery.length > 1 && <>
          <button type="button" onClick={previous} aria-label="Previous vehicle image" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',width:48,height:48,border:'1px solid rgba(255,255,255,.22)',borderRadius:'50%',background:'rgba(0,0,0,.58)',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><ChevronLeft size={30}/></button>
          <button type="button" onClick={next} aria-label="Next vehicle image" style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',width:48,height:48,border:'1px solid rgba(255,255,255,.22)',borderRadius:'50%',background:'rgba(0,0,0,.58)',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><ChevronRight size={30}/></button>
        </>}
        <span style={{position:'absolute',left:'50%',bottom:-34,transform:'translateX(-50%)',color:'rgba(255,255,255,.78)',fontSize:11,fontWeight:900,letterSpacing:'.14em'}}>{index + 1} / {gallery.length}</span>
      </div>
    </div>}
  </>
}
