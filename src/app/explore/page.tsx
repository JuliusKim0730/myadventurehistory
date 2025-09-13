'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { travelService, type TravelRecord } from '@/lib/firestore'
import Image from 'next/image'
import { Search, MapPin, Calendar, User as UserIcon, Home } from 'lucide-react'

export default function Explore() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [trips, setTrips] = useState<TravelRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
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
      loadTrips()
    }
  }, [user])

  const loadTrips = async () => {
    try {
      const allTrips = await travelService.getAll()
      // 공개된 여행만 표시
      const publicTrips = allTrips.filter(trip => trip.visibility === 'public')
      setTrips(publicTrips)
    } catch (error) {
      console.error('여행 기록 로딩 실패:', error)
    }
  }

  // 모든 여행지 목록 추출
  const allDestinations = Array.from(
    new Set(trips.flatMap(trip => trip.destinations.map(dest => dest.name)))
  )

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinations.some(dest => dest.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDestination = !selectedDestination || 
      trip.destinations.some(dest => dest.name === selectedDestination)
    
    const matchesDateRange = (!dateRange.start || !dateRange.end) ||
      (new Date(trip.startDate.toDate()) >= new Date(dateRange.start) &&
       new Date(trip.endDate.toDate()) <= new Date(dateRange.end))
    
    return matchesSearch && matchesDestination && matchesDateRange
  })

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
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-skybase-800 hover:text-skybase-900"
              >
                <Home className="h-4 w-4" />
                대시보드
              </button>
              <button
                onClick={() => router.push('/create')}
                className="rounded-xl bg-skybase-600 px-4 py-2 text-white hover:bg-skybase-700"
              >
                + 기록 작성
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl p-6">
        {/* 헤더 */}
        <div className="mb-8 rounded-3xl bg-white/60 p-6 shadow-fluffy backdrop-blur">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-skybase-900">
            <MapPin className="h-8 w-8" />
            모든 여행 기록 🌍
          </h1>
          <p className="mt-2 text-skybase-900/80">다른 여행자들의 특별한 순간들을 탐험해보세요</p>
        </div>

        {/* 검색 및 필터 바 */}
        <div className="mb-6 rounded-2xl bg-white/60 p-6 shadow-fluffy backdrop-blur">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-skybase-500" />
              <input
                type="text"
                placeholder="여행지나 제목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-skybase-200 bg-white/80 pl-10 pr-4 py-2 focus:border-skybase-500 focus:outline-none"
                aria-label="여행 기록 검색"
              />
            </div>

            {/* 여행지 필터 */}
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="rounded-xl border border-skybase-200 bg-white/80 px-4 py-2 focus:border-skybase-500 focus:outline-none"
              aria-label="여행지 필터"
            >
              <option value="">모든 여행지</option>
              {allDestinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>

            {/* 날짜 범위 */}
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="flex-1 rounded-xl border border-skybase-200 bg-white/80 px-3 py-2 text-sm focus:border-skybase-500 focus:outline-none"
                aria-label="시작 날짜"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="flex-1 rounded-xl border border-skybase-200 bg-white/80 px-3 py-2 text-sm focus:border-skybase-500 focus:outline-none"
                aria-label="종료 날짜"
              />
            </div>

            {/* 정렬 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
              className="rounded-xl border border-skybase-200 bg-white/80 px-4 py-2 focus:border-skybase-500 focus:outline-none"
              aria-label="정렬 방식 선택"
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>

          {/* 필터 초기화 */}
          {(searchTerm || selectedDestination || dateRange.start || dateRange.end) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedDestination('')
                setDateRange({ start: '', end: '' })
              }}
              className="mt-4 text-sm text-skybase-700 hover:text-skybase-900 underline"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 여행 기록 그리드 */}
        {filteredTrips.length === 0 ? (
          <div className="rounded-3xl bg-white/60 p-12 text-center shadow-fluffy backdrop-blur">
            <div className="mb-4 text-6xl">🧳</div>
            <h3 className="mb-2 text-xl font-semibold text-skybase-900">
              {trips.length === 0 ? '아직 공개된 여행 기록이 없습니다' : '검색 결과가 없습니다'}
            </h3>
            <p className="mb-6 text-skybase-900/80">
              {trips.length === 0 
                ? '첫 번째 여행자가 되어보세요!' 
                : '다른 검색어나 필터를 시도해보세요'
              }
            </p>
            <button
              onClick={() => router.push('/create')}
              className="rounded-xl bg-skybase-600 px-6 py-3 font-medium text-white shadow-fluffy hover:bg-skybase-700"
              aria-label="첫 번째 여행 기록 작성하기"
            >
              첫 번째 여행 기록 작성하기
            </button>
          </div>
        ) : (
          <>
            {/* 결과 개수 */}
            <div className="mb-4 text-sm text-skybase-900/70">
              총 {filteredTrips.length}개의 여행 기록
            </div>

            {/* 카드 그리드 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => router.push(`/trip/${trip.id}`)}
                  className="group cursor-pointer rounded-2xl bg-white/60 p-4 shadow-fluffy backdrop-blur transition hover:bg-white hover:shadow-lg hover:scale-[1.02]"
                >
                  {/* 썸네일 */}
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-skybase-100">
                    {trip.coverUrl ? (
                      <Image
                        src={trip.coverUrl}
                        alt={trip.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🏞️
                      </div>
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="font-semibold text-skybase-900 line-clamp-1">
                    {trip.title}
                  </h3>

                  {/* 기간 */}
                  <div className="mt-1 flex items-center gap-1 text-sm text-skybase-700">
                    <Calendar className="h-4 w-4" />
                    {trip.nights}박 {trip.days}일
                  </div>

                  {/* 작성자 */}
                  <div className="mt-2 flex items-center gap-1 text-sm text-skybase-900/80">
                    <UserIcon className="h-4 w-4" />
                    {trip.authorNickname || '익명'}
                  </div>

                  {/* 여행지 태그 */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {trip.destinations.slice(0, 3).map((dest, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-skybase-100 px-2 py-1 text-xs text-skybase-700"
                      >
                        {dest.name}
                      </span>
                    ))}
                    {trip.destinations.length > 3 && (
                      <span className="rounded-full bg-skybase-100 px-2 py-1 text-xs text-skybase-700">
                        +{trip.destinations.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 생성일 */}
                  <div className="mt-3 text-xs text-skybase-900/60">
                    {new Date(trip.createdAt.toDate()).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}