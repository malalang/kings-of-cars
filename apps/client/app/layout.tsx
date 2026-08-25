import type { Metadata } from 'next'
import { SiteHeader } from '../components/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: 'King of Cars | Quality Used Cars',
  description: 'Browse quality pre-owned vehicles, explore finance solutions, sell your car and connect with King of Cars in Boksburg.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}</body></html>
}
