import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Local Weather Tracker',
  description: 'Hyperlocal weather for Local coordinates',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
