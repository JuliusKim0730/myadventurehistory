'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { travelService, timelineService, type TravelRecord, type TimelineCard } from '@/lib/firestore'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User as UserIcon, 
  Heart, 
  Share2, 
  Clock,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Home
} from 'lucide-react'

export default function TripDetail() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [trip, setTrip] = useState<TravelRecord | null>(null)
  const [timelineCards, setTimelineCards] = useState<TimelineCard[]>([])
  const [selectedDay, setSelectedDay] = useState(1)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (tripId) {
      loadTripData()
    }
  }, [tripId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (trip && user) {
      setIsOwner(trip.ownerUid === user.uid)
    }
  }, [trip, user])

  const loadTripData = async () => {
    try {
      const tripData = await travelService.getById(tripId)
      if (!tripData) {
        router.push('/explore')
        return
      }

      // 비공개 여행이고 소유자가 아닌 경우
      if (tripData.visibility === 'private' && (!user || tripData.ownerUid !== user.uid)) {
        alert('접근 권한이 없습니다.')
        router.push('/explore')
        return
      }

      setTrip(tripData)
      
      // 타임라인 카드 로드
      const cards = await timelineService.getAll(tripId)
      setTimelineCards(cards)
    } catch (error) {
      console.error('여행 데이터 로딩 실패:', error)
      router.push('/explore')
    }
  }

  const getDayCards = (day: number) => {
    return timelineCards.filter(card => card.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const generateDayTabs = () => {
    if (!trip) return []
    const tabs = []
    for (let i = 1; i <= trip.days; i++) {
      tabs.push(i)
    }
    return tabs
  }

  const handleLike = async () => {
    // TODO: 좋아요 기능 구현
    console.log('좋아요 기능 준비 중')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다!')
    } catch (error) {
      console.error('링크 복사 실패:', error)
    }
  }

  if (loading) return (
    <div className="flex min-h-dvh items-center justify-center bg-sky-gradient">
      <div className="rounded-2xl bg-white/60 p-8 shadow-fluffy backdrop-blur">
        <div className="text-center text-skybase-900">로딩 중…</div>
      </div>
    </div>
  )

  if (!trip) return null

  const dayCards = getDayCards(selectedDay)

  return (
    <main className="min-h-dvh bg-sky-gradient">
      {/* 네비게이션 바 */}
      <nav className="bg-skybase-200/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-skybase-800 hover:text-skybase-900"
              >
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </button>
              <div className="text-xl font-bold text-skybase-900">
                여행 상세
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-skybase-800 hover:text-skybase-900"
              >
                <Home className="h-4 w-4" />
                대시보드
              </button>
              {isOwner && (
                <button
                  onClick={() => router.push(`/edit/${tripId}`)}
                  className="flex items-center gap-2 rounded-xl bg-skybase-600 px-4 py-2 text-white hover:bg-skybase-700"
                >
                  <Edit className="h-4 w-4" />
                  수정
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl p-6">
        {/* 헤더 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-white/60 p-8 shadow-fluffy backdrop-blur"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 썸네일 */}
            <div className="lg:col-span-1">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-skybase-100">
                {trip.coverUrl ? (
                  <Image
                    src={trip.coverUrl}
                    alt={trip.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">
                    🏞️
                  </div>
                )}
              </div>
            </div>

            {/* 정보 */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-skybase-900 mb-4">
                {trip.title}
              </h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-skybase-700">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">{trip.nights}박 {trip.days}일</span>
                  <span className="text-skybase-500">
                    ({new Date(trip.startDate.toDate()).toLocaleDateString('ko-KR')} ~ {new Date(trip.endDate.toDate()).toLocaleDateString('ko-KR')})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-skybase-700">
                  <UserIcon className="h-5 w-5" />
                  <span>{trip.authorNickname || '익명'}</span>
                </div>

                <div className="flex items-start gap-2 text-skybase-700">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {trip.destinations.map((dest, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-skybase-100 px-3 py-1 text-sm text-skybase-700"
                      >
                        {dest.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-skybase-800 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                  좋아요 {trip.likesCount || 0}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-skybase-800 hover:bg-white"
                >
                  <Share2 className="h-4 w-4" />
                  공유
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 일차 탭 */}
        <div className="mb-6 rounded-2xl bg-white/60 p-4 shadow-fluffy backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {generateDayTabs().map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  selectedDay === day
                    ? 'bg-skybase-600 text-white'
                    : 'bg-white/50 text-skybase-800 hover:bg-white'
                }`}
              >
                {day}일차
              </button>
            ))}
          </div>
        </div>

        {/* 타임라인 콘텐츠 */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/60 p-8 shadow-fluffy backdrop-blur"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-skybase-900">
              {selectedDay}일차 일정
            </h2>
            {isOwner && (
              <button
                onClick={() => {
                  // TODO: 타임라인 카드 추가 기능
                  console.log('타임라인 카드 추가 기능 준비 중')
                }}
                className="flex items-center gap-2 rounded-xl bg-skybase-600 px-4 py-2 text-white hover:bg-skybase-700"
              >
                <Plus className="h-4 w-4" />
                일정 추가
              </button>
            )}
          </div>

          {dayCards.length === 0 ? (
            <div className="rounded-xl bg-skybase-50 p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-skybase-400 mb-4" />
              <h3 className="text-lg font-medium text-skybase-900 mb-2">
                아직 일정이 없습니다
              </h3>
              <p className="text-skybase-600">
                {isOwner ? '첫 번째 일정을 추가해보세요!' : '일정이 등록되지 않았습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {dayCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl bg-white/50 p-6 border border-skybase-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-skybase-600 text-white font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-skybase-900">{card.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-skybase-600">
                          <Clock className="h-4 w-4" />
                          <span>{card.startTime}</span>
                          {card.endTime && <span>~ {card.endTime}</span>}
                        </div>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex gap-2">
                        <button className="text-skybase-500 hover:text-skybase-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-skybase-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {card.place && (
                    <div className="mb-4 flex items-center gap-2 text-skybase-700">
                      <MapPin className="h-4 w-4" />
                      <span>{card.place}</span>
                    </div>
                  )}

                  {card.photos && card.photos.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {card.photos.map((photo, idx) => (
                          <div key={idx} className="relative aspect-square overflow-hidden rounded-xl">
                            <Image
                              src={photo}
                              alt={`${card.title} 사진 ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {card.plan && (
                    <div className="mb-4">
                      <h4 className="font-medium text-skybase-900 mb-2">계획</h4>
                      <p className="text-skybase-700 bg-skybase-50 rounded-xl p-4">
                        {card.plan}
                      </p>
                    </div>
                  )}

                  {card.experience && (
                    <div className="mb-4">
                      <h4 className="font-medium text-skybase-900 mb-2">실제 경험</h4>
                      <p className="text-skybase-700 bg-white/80 rounded-xl p-4">
                        {card.experience}
                      </p>
                    </div>
                  )}

                  {card.refUrl && (
                    <div>
                      <a
                        href={card.refUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-skybase-600 hover:text-skybase-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        참고 링크
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
