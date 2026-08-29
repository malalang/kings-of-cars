/**
 * Shared public business information used throughout the Kings of Cars client.
 * Keep customer-facing contact details here so header, vehicles, enquiries and
 * floating contact actions never drift apart.
 */
export const BUSINESS_INFO = {
  brandName: 'King of Cars',
  legalName: 'King Of Cars Group',
  branchName: 'Trichardts Road, Boksburg',
  address: '82 Trichardts Rd, Ravenswood, Boksburg, 1459, South Africa',
  email: 'leads@kingofcars.co.za',
  agentName: 'King of Cars Sales Team',
  phones: ['010 823 9006', '010 492 6780', '011 594 2556', '011 918 9210'] as const,
  primaryPhone: '011 894 5233',
  whatsappNumber: '011 894 5233',
  officeHours: {
    weekdays: 'Monday - Friday: 08:00 - 18:00',
    saturday: 'Saturday: 09:00 - 15:00',
    sunday: 'Sunday: Closed',
    publicHolidays: 'Public Holidays: 09:00 - 13:00',
  },
  website: 'https://www.kingofcars.co.za',
  whatsapp: {
    number: '011 894 5233',
    internationalNumber: '27118945233',
    baseUrl: 'https://wa.me/27118945233',
  },
  messages: {
    general: 'Hi King of Cars, I would like to enquire about your available vehicles.',
    vehicle: (vehicleTitle: string, price?: string, url?: string) =>
      `Hi ${'King of Cars Sales Team'}, I am interested in the ${vehicleTitle}${price ? ` listed at ${price}` : ''}.${url ? `\n\nVehicle: ${url}` : ''}\n\nPlease assist me with availability and more information.`,
    sell: 'Hi King of Cars, I would like to enquire about selling my car.',
    finance: 'Hi King of Cars, I would like to enquire about vehicle finance.',
  },
} as const

export type BusinessInfo = typeof BUSINESS_INFO

export const BUSINESS_PHONE_LINKS = BUSINESS_INFO.phones.map((phone) => ({
  label: phone,
  href: `tel:${phone.replace(/\s/g, '')}`,
}))

export const WHATSAPP_LINK = BUSINESS_INFO.whatsapp.baseUrl
