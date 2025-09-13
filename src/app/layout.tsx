import type { Metadata } from 'next'
import './globals.css'
import { Noto_Sans_KR } from 'next/font/google'
import { AuthProvider } from '@/providers/AuthProvider'

const noto = Noto_Sans_KR({ subsets: ['latin'], variable: '--font-noto-sans-kr' })

export const metadata: Metadata = {
  title: 'My Adventure History',
  description: 'Travel journaling & sharing with sky-blue vibes',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${noto.variable} font-sans min-h-dvh bg-sky-gradient text-skybase-900`}>
        <AuthProvider>
          <div className="relative min-h-dvh">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}