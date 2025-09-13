'use client'
import { AuthProvider } from '@/providers/AuthProvider'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative min-h-dvh">
        {children}
      </div>
    </AuthProvider>
  )
}
