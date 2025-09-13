'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { travelService, type TravelRecord } from '@/lib/firestore'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Compass, 
  BookOpen, 
  Settings, 
  LogOut,
  Calendar,
  Eye,
  EyeOff,
  FileText
} from 'lucide-react'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [myTrips, setMyTrips] = useState<TravelRecord[]>([])
  const [recentTrips, setRecentTrips] = useState<TravelRecord[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadUserTrips()
      loadRecentTrips()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserTrips = async () => {
    if (!user) return
    try {
      const allTrips = await travelService.getAll()
      const userTrips = allTrips.filter(trip => trip.ownerUid === user.uid)
      setMyTrips(userTrips)
    } catch (error) {
      console.error('내 여행 기록 로딩 실패:', error)
    }
  }

  const loadRecentTrips = async () => {
    try {
      const allTrips = await travelService.getAll()
      const publicTrips = allTrips
        .filter(trip => trip.visibility === 'public')
        .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
        .slice(0, 6)
      setRecentTrips(publicTrips)
    } catch (error) {
      console.error('최근 여행 기록 로딩 실패:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Eye className="h-4 w-4" />
      case 'private': return <EyeOff className="h-4 w-4" />
      case 'draft': return <FileText className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'public': return '공개'
      case 'private': return '비공개'
      case 'draft': return '초안'
      default: return '공개'
    }
  }

  if (loading) return (
    <div className="flex min-h-dvh items-center justify-center bg-sky-gradient">
      <div className="rounded-2xl bg-white/60 p-8 shadow-fluffy backdrop-blur">
        <div className="text-center text-skybase-900">로딩 중…</div>
      </div>
    </div>
  )
  
  if (!user) return null

  return (
    <main className="min-h-dvh bg-sky-gradient">
      {/* 네비게이션 바 */}
      <nav className="bg-skybase-200/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => router.push('/')}
              className="cursor-pointer text-xl font-bold text-skybase-900"
            >
              My Adventure History
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-skybase-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </div>
                <span className="text-skybase-900 font-medium">
                  {user.displayName || '여행자'}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-skybase-800 hover:text-skybase-900"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl p-6">
        {/* 환영 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-white/60 p-8 shadow-fluffy backdrop-blur"
        >
          <h1 className="text-3xl font-bold text-skybase-900 mb-2">
            환영합니다, {user.displayName || '여행자'}님! ☀️
          </h1>
          <p className="text-skybase-900/80 mb-6">
            특별한 여행의 순간들을 기록하고 추억을 만들어보세요.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/create')}
              className="flex items-center gap-2 rounded-xl bg-skybase-600 px-6 py-3 font-medium text-white shadow-fluffy hover:bg-skybase-700"
            >
              <Plus className="h-4 w-4" />
              새로운 여행 기록하기
            </button>
            <button
              onClick={() => router.push('/explore')}
              className="flex items-center gap-2 rounded-xl bg-white/80 px-6 py-3 font-medium text-skybase-800 shadow-fluffy hover:bg-white"
            >
              <Compass className="h-4 w-4" />
              기록 둘러보기
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽: 빠른 액션 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white/60 p-6 shadow-fluffy backdrop-blur"
            >
              <h2 className="text-xl font-bold text-skybase-900 mb-4">빠른 액션</h2>
              <div className="space-y-3">
                <QuickActionCard
                  icon={<Plus className="h-5 w-5" />}
                  title="새 여행 기록"
                  desc="새로운 모험을 시작하세요"
                  onClick={() => router.push('/create')}
                />
                <QuickActionCard
                  icon={<Compass className="h-5 w-5" />}
                  title="여행 탐색"
                  desc="다른 여행자들의 이야기"
                  onClick={() => router.push('/explore')}
                />
                <QuickActionCard
                  icon={<Settings className="h-5 w-5" />}
                  title="설정"
                  desc="프로필 및 계정 관리"
                  onClick={() => router.push('/settings')}
                />
              </div>
            </motion.div>

            {/* 통계 카드 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/60 p-6 shadow-fluffy backdrop-blur"
            >
              <h2 className="text-xl font-bold text-skybase-900 mb-4">나의 여행 통계</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-skybase-600">{myTrips.length}</div>
                  <div className="text-sm text-skybase-700">총 여행</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-skybase-600">
                    {myTrips.filter(trip => trip.visibility === 'public').length}
                  </div>
                  <div className="text-sm text-skybase-700">공개 여행</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 오른쪽: 나의 여행 기록 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 나의 여행 기록 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white/60 p-6 shadow-fluffy backdrop-blur"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-skybase-900">나의 여행 기록</h2>
                <button
                  onClick={() => router.push('/dashboard/trips')}
                  className="text-skybase-600 hover:text-skybase-800 text-sm font-medium"
                >
                  전체보기 →
                </button>
              </div>

              {myTrips.length === 0 ? (
                <div className="rounded-xl bg-skybase-50 p-8 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-skybase-400 mb-4" />
                  <h3 className="text-lg font-medium text-skybase-900 mb-2">
                    첫 번째 여행을 기록해보세요!
                  </h3>
                  <p className="text-skybase-600 mb-4">
                    특별한 순간들을 기록하고 추억을 만들어보세요
                  </p>
                  <button
                    onClick={() => router.push('/create')}
                    className="rounded-xl bg-skybase-600 px-4 py-2 text-white hover:bg-skybase-700"
                  >
                    여행 기록 시작하기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTrips.slice(0, 3).map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => router.push(`/trip/${trip.id}`)}
                      className="flex items-center gap-4 rounded-xl bg-white/50 p-4 cursor-pointer hover:bg-white transition"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-skybase-100 flex-shrink-0">
                        {trip.coverUrl ? (
                          <Image
                            src={trip.coverUrl}
                            alt={trip.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xl">
                            🏞️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-skybase-900 truncate">
                          {trip.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-skybase-600">
                          <Calendar className="h-3 w-3" />
                          <span>{trip.nights}박 {trip.days}일</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-skybase-600">
                          {getVisibilityIcon(trip.visibility)}
                          <span>{getVisibilityLabel(trip.visibility)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 최근 여행 기록 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/60 p-6 shadow-fluffy backdrop-blur"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-skybase-900">최근 여행 기록</h2>
                <button
                  onClick={() => router.push('/explore')}
                  className="text-skybase-600 hover:text-skybase-800 text-sm font-medium"
                >
                  더보기 →
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {recentTrips.slice(0, 4).map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => router.push(`/trip/${trip.id}`)}
                    className="group cursor-pointer rounded-xl bg-white/50 p-4 hover:bg-white transition"
                  >
                    <div className="relative mb-3 h-24 w-full overflow-hidden rounded-lg bg-skybase-100">
                      {trip.coverUrl ? (
                        <Image
                          src={trip.coverUrl}
                          alt={trip.title}
                          fill
                          className="object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">
                          🏞️
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-skybase-900 truncate mb-1">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-skybase-600 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>{trip.nights}박 {trip.days}일</span>
                    </div>
                    <div className="text-xs text-skybase-500">
                      by {trip.authorNickname || '익명'}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

function QuickActionCard({ 
  icon, 
  title, 
  desc, 
  onClick 
}: { 
  icon: React.ReactNode
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl bg-white/50 p-4 text-left hover:bg-white transition"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-skybase-100 text-skybase-600">
          {icon}
        </div>
        <div>
          <div className="font-medium text-skybase-900">{title}</div>
          <div className="text-sm text-skybase-600">{desc}</div>
        </div>
      </div>
    </button>
  )
}