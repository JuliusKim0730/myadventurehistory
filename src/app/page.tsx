'use client'
import SkyBackground from '@/components/SkyBackground'
import TransportSequence from '@/components/TransportSequence'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase'

export default function Page() {
  const [loading, setLoading] = useState<'google' | 'guest' | null>(null)
  const router = useRouter()

  const handleGoogle = async () => {
    setLoading('google')
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      setLoading(null)
      alert('구글 로그인에 실패했습니다. Firebase 설정과 승인 도메인을 확인하세요.')
    }
  }

  const handleGuest = async () => {
    setLoading('guest')
    try {
      await signInAsGuest()
      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      setLoading(null)
      alert('게스트 로그인에 실패했습니다. 익명 인증이 활성화되어 있는지 확인하세요.')
    }
  }

  return (
    <main className="relative min-h-dvh">
      {/* 하늘 배경 */}
      <SkyBackground className="absolute inset-0" />

      {/* 메인 콘텐츠 */}
      <section className="relative z-10 flex min-h-dvh items-center justify-center px-6">
        <div className="w-full max-w-4xl rounded-3xl bg-white/50 p-8 text-center shadow-fluffy backdrop-blur">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-skybase-900"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Adventure History 🌟
          </motion.h1>

          <motion.p
            className="mt-3 text-skybase-900/80 md:text-lg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            나만의 특별한 여행 기록을 만들고 공유하는 플랫폼
          </motion.p>

          {/* 교통수단 시퀀스 애니메이션 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <TransportSequence />
          </motion.div>

          {/* 메인 메시지 + 로그인 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="mt-4 whitespace-pre-line text-lg font-medium text-skybase-900/90">
              인생을 살며, 즐겨야할 때가 있다.
              {'\n'}남들이 짠 계획이 아닌 우리만의 모험을 해보자.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleGoogle}
                disabled={!!loading}
                className="w-full sm:w-auto rounded-xl bg-skybase-600 px-6 py-3 font-medium text-white shadow-fluffy transition hover:bg-skybase-700 disabled:opacity-50"
              >
                {loading === 'google' ? '로그인 중…' : 'Google로 시작하기'}
              </button>
              <button
                onClick={handleGuest}
                disabled={!!loading}
                className="w-full sm:w-auto text-sm text-skybase-800/80 underline underline-offset-4 transition hover:text-skybase-800"
              >
                {loading === 'guest' ? '입장 중…' : '게스트로 로그인하기'}
              </button>
            </div>
          </motion.div>

          <p className="mt-8 text-xs text-skybase-900/60">
            © {new Date().getFullYear()} My Adventure History
          </p>
        </div>
      </section>
    </main>
  )
}