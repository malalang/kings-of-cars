import './globals.css'

export const metadata = { title: 'King of Cars Admin' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
