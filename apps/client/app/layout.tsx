import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'King of Cars | Quality Used Cars',
  description: 'Browse quality pre-owned vehicles, explore finance solutions, sell your car and connect with King of Cars in Boksburg.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
