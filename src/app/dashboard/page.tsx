'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { MapPin, Plus, Calendar, LogOut } from 'lucide-react'
import SkyBackground from '@/components/SkyBackground'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (!user) {
        router.push('/')
      }
    })

    return unsubscribe
  }, [router])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-sky-gradient flex items-center justify-center">
        <div className="text-skybase-800 text-xl">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="relative min-h-dvh">
      <SkyBackground className="absolute inset-0" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur border-b border-skybase-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-skybase-800">My Adventure History</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-skybase-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.displayName?.[0] || user.email?.[0] || 'G'}
                    </span>
                  </div>
                  <span className="text-skybase-700 font-medium">
                    {user.displayName || user.email || '게스트'}
                  </span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-2 text-skybase-600 hover:text-skybase-800 transition-colors"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <motion.div
            className="bg-white/70 backdrop-blur rounded-2xl p-8 mb-8 shadow-fluffy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-skybase-800 mb-4">
                환영합니다, {user.displayName?.split(' ')[0] || '여행자'}님! 🌟
              </h2>
              <p className="text-skybase-700 mb-6">
                특별한 여행의 순간들을 기록하고 추억을 만들어보세요.
              </p>
              
              <motion.button
                className="bg-skybase-600 hover:bg-skybase-700 text-white font-semibold py-3 px-6 rounded-xl shadow-fluffy transition-all duration-300 flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/create')}
              >
                <Plus size={20} />
                새로운 여행 기록하기
              </motion.button>
            </div>
          </motion.div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 나의 여행 기록 */}
            <motion.div
              className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-fluffy hover:shadow-lg transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={() => router.push('/my-travels')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-skybase-800">나의 여행 기록</h3>
                <MapPin className="text-skybase-500" size={24} />
              </div>
              <p className="text-skybase-700 mb-4">
                내가 다녀온 특별한 여행들을 확인하고 관리해보세요.
              </p>
              <div className="text-sm text-skybase-600 font-medium">
                바로가기 →
              </div>
            </motion.div>

            {/* 모든 여행 기록 */}
            <motion.div
              className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-fluffy hover:shadow-lg transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => router.push('/explore')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-skybase-800">모든 여행 기록</h3>
                <Calendar className="text-green-500" size={24} />
              </div>
              <p className="text-skybase-700 mb-4">
                다른 여행자들의 멋진 여행 이야기를 둘러보세요.
              </p>
              <div className="text-sm text-green-600 font-medium">
                둘러보기 →
              </div>
            </motion.div>

            {/* 여행 계획하기 */}
            <motion.div
              className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-fluffy hover:shadow-lg transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => router.push('/create')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-skybase-800">새 여행 계획</h3>
                <Plus className="text-purple-500" size={24} />
              </div>
              <p className="text-skybase-700 mb-4">
                새로운 모험을 계획하고 기록을 시작해보세요.
              </p>
              <div className="text-sm text-purple-600 font-medium">
                시작하기 →
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            className="bg-white/70 backdrop-blur rounded-2xl p-8 mt-8 shadow-fluffy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-skybase-800 mb-6">최근 활동</h3>
            <div className="text-center py-12">
              <div className="text-skybase-400 mb-4">
                <Calendar size={48} className="mx-auto" />
              </div>
              <p className="text-skybase-600">
                아직 여행 기록이 없습니다. 첫 번째 여행을 기록해보세요!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}