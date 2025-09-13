'use client'
import { useEffect, useState } from 'react'
import { AuthProvider } from '@/providers/AuthProvider'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 서버 사이드에서는 AuthProvider 없이 렌더링
  if (!mounted) {
    return (
      <div className="relative min-h-dvh bg-sky-gradient">
        <div className="flex min-h-dvh items-center justify-center">
          <div className="rounded-2xl bg-white/60 p-8 shadow-lg backdrop-blur">
            <div className="text-center text-gray-600">로딩 중...</div>
          </div>
        </div>
      </div>
    )
  }

  // 클라이언트에서만 AuthProvider 사용
  return (
    <AuthProvider>
      <div className="relative min-h-dvh">
        {children}
      </div>
    </AuthProvider>
  )
}
