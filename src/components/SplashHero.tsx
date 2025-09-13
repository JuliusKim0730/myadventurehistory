'use client'
import { motion } from 'framer-motion'
import { Plane, Ship, Car, TrainFront, Github } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase'

export default function SplashHero() {
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

  const iconVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto px-6">
      <div className="text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-skybase-800 drop-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Adventure History 🌟
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl text-skybase-800/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          나만의 특별한 여행 기록을 만들고 공유하는 플랫폼
        </motion.p>
      </div>

      {/* transport icons */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[Plane, Ship, Car, TrainFront].map((Icon, i) => (
          <motion.div
            key={i}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow-fluffy flex items-center justify-center"
          >
            <Icon className="h-10 w-10 md:h-12 md:w-12 text-skybase-700" />
          </motion.div>
        ))}
      </div>

      {/* actions */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-3">
        <button
          onClick={handleGoogle}
          disabled={!!loading}
          className="inline-flex items-center gap-3 rounded-xl bg-skybase-600 hover:bg-skybase-700 text-white px-5 py-3 font-medium shadow-fluffy transition"
        >
          {loading === 'google' ? '로그인 중…' : 'Google로 시작하기'}
        </button>
        <button
          onClick={handleGuest}
          disabled={!!loading}
          className="inline-flex items-center gap-3 rounded-xl bg-white/80 hover:bg-white text-skybase-800 px-5 py-3 font-medium shadow-fluffy backdrop-blur transition"
        >
          {loading === 'guest' ? '입장 중…' : '게스트로 둘러보기'}
        </button>
        <a
          href="https://github.com/JuliusKim0730/myadventurehistory"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-white/60 hover:bg-white text-skybase-800 px-4 py-3 font-medium shadow-fluffy backdrop-blur transition"
        >
          <Github className="h-5 w-5" /> GitHub
        </a>
      </div>

      <p className="mt-6 text-center text-sm text-skybase-900/70">
        "인생을 살며, 즐겨야할 때가 있다. 남들이 짠 계획이 아닌 우리만의 모험을 해보자."
      </p>
    </div>
  )
}
