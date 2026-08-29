'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { BUSINESS_INFO } from '@kings-of-cars/constants/Business_info'

export function WhatsAppFloat() {
  const href = `${BUSINESS_INFO.whatsapp.baseUrl}?text=${encodeURIComponent(BUSINESS_INFO.messages.general)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${BUSINESS_INFO.brandName} on WhatsApp`}
      title="Chat with King of Cars on WhatsApp"
      style={{
        position: 'fixed',
        right: 22,
        bottom: 22,
        zIndex: 1000,
        width: 58,
        height: 58,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        background: '#25D366',
        color: '#fff',
        boxShadow: '0 10px 28px rgba(0,0,0,.25)',
        textDecoration: 'none',
        transition: 'transform .2s ease, box-shadow .2s ease',
      }}
    >
      <FaWhatsapp size={31} aria-hidden="true" />
    </a>
  )
}
