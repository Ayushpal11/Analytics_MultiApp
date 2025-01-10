import './globals.css'
import { Mona_Sans as FontSans } from 'next/font/google'
import { Providers } from './providers'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'InsightHub-Dashboard',
  description: 'Developed by Ayush Pal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${fontSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

