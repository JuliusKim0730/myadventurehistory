'use client'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { travelService } from '@/lib/firestore'
import { Timestamp } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Camera, 
  Globe, 
  Lock, 
  FileText,
  Plus,
  X,
  Clock,
  Home
} from 'lucide-react'

interface Destination {
  name: string
  startDate: string
  endDate: string
}

interface TravelFormData {
  startDate: string
  endDate: string
  title: string
  coverUrl: string
  visibility: 'public' | 'private' | 'draft'
  destinations: Destination[]
}

export default function CreateTrip() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<TravelFormData>({
    startDate: '',
    endDate: '',
    title: '',
    coverUrl: '',
    visibility: 'public',
    destinations: []
  })

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

  // 박/일 계산
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return { days: 0, nights: 0 }
    
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const nights = Math.max(0, days - 1)
    
    return { days, nights }
  }

  // 제목 자동 생성
  const generateTitle = () => {
    if (!formData.startDate || formData.destinations.length === 0) return ''
    
    const date = new Date(formData.startDate)
    const dateStr = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/ /g, '')
    
    const mainDestination = formData.destinations[0]?.name || '여행'
    return `${dateStr} ${mainDestination}`
  }

  // 여행지 추가
  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, { name: '', startDate: '', endDate: '' }]
    }))
  }

  // 여행지 제거
  const removeDestination = (index: number) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index)
    }))
  }

  // 여행지 업데이트
  const updateDestination = (index: number, field: keyof Destination, value: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => 
        i === index ? { ...dest, [field]: value } : dest
      )
    }))
  }

  // 저장
  const handleSave = async (publish: boolean = false) => {
    if (!user) return

    setSaving(true)
    try {
      const { days, nights } = calculateDuration()
      const title = formData.title || generateTitle()

      const travelRecord = {
        title,
        startDate: Timestamp.fromDate(new Date(formData.startDate)),
        endDate: Timestamp.fromDate(new Date(formData.endDate)),
        days,
        nights,
        destinations: formData.destinations,
        coverUrl: formData.coverUrl,
        visibility: publish ? formData.visibility : ('draft' as const),
        ownerUid: user.uid,
        authorNickname: user.displayName || '익명',
        likesCount: 0,
        commentsCount: 0
      }

      const tripId = await travelService.create(travelRecord)
      
      if (publish) {
        router.push(`/trip/${tripId}`)
      } else {
        alert('임시저장되었습니다.')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
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

  const { days, nights } = calculateDuration()

  return (
    <main className="min-h-dvh bg-sky-gradient">
      {/* 네비게이션 바 */}
      <nav className="bg-skybase-200/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-skybase-800 hover:text-skybase-900"
              >
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </button>
              <div className="text-xl font-bold text-skybase-900">
                새 여행 기록
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-skybase-800 hover:text-skybase-900"
              >
                <Home className="h-4 w-4" />
                대시보드
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl p-6">
        {/* 진행 단계 */}
        <div className="mb-8 rounded-2xl bg-white/60 p-6 shadow-fluffy backdrop-blur">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-skybase-600 text-white' 
                    : 'bg-skybase-200 text-skybase-600'
                }`}>
                  {step}
                </div>
                <div className={`ml-2 text-sm ${
                  currentStep >= step ? 'text-skybase-900' : 'text-skybase-600'
                }`}>
                  {step === 1 && '기본 정보'}
                  {step === 2 && '여행지 & 구간'}
                  {step === 3 && '일차 타임라인'}
                </div>
                {step < 3 && (
                  <div className={`mx-4 h-0.5 w-16 ${
                    currentStep > step ? 'bg-skybase-600' : 'bg-skybase-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 단계별 콘텐츠 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl bg-white/60 p-8 shadow-fluffy backdrop-blur"
        >
          {/* 1단계: 기본 정보 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-skybase-900">기본 정보</h2>
              
              {/* 날짜 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-skybase-900 mb-2">
                    출발일 *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-xl border border-skybase-200 bg-white/80 px-4 py-3 focus:border-skybase-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-skybase-900 mb-2">
                    종료일 *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-xl border border-skybase-200 bg-white/80 px-4 py-3 focus:border-skybase-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* 기간 표시 */}
              {formData.startDate && formData.endDate && (
                <div className="rounded-xl bg-skybase-50 p-4">
                  <div className="flex items-center gap-2 text-skybase-700">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{nights}박 {days}일</span>
                  </div>
                </div>
              )}

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-skybase-900 mb-2">
                  여행 제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={generateTitle() || 'YYYY.MM.DD 여행지'}
                  className="w-full rounded-xl border border-skybase-200 bg-white/80 px-4 py-3 focus:border-skybase-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-skybase-600">
                  비워두면 자동으로 생성됩니다
                </p>
              </div>

              {/* 썸네일 */}
              <div>
                <label className="block text-sm font-medium text-skybase-900 mb-2">
                  대표 썸네일
                </label>
                <div className="rounded-xl border-2 border-dashed border-skybase-300 p-8 text-center">
                  <Camera className="mx-auto h-12 w-12 text-skybase-400 mb-4" />
                  <p className="text-skybase-600">이미지를 업로드하세요</p>
                  <p className="text-xs text-skybase-500 mt-1">JPG, PNG 파일 (최대 5MB)</p>
                </div>
              </div>

              {/* 공개 설정 */}
              <div>
                <label className="block text-sm font-medium text-skybase-900 mb-2">
                  공개 설정
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'public', icon: Globe, label: '공개', desc: '모든 사람이 볼 수 있음' },
                    { value: 'private', icon: Lock, label: '비공개', desc: '나만 볼 수 있음' },
                    { value: 'draft', icon: FileText, label: '초안', desc: '작성 중인 상태' }
                  ].map(({ value, icon: Icon, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => setFormData(prev => ({ ...prev, visibility: value as 'public' | 'private' | 'draft' }))}
                      className={`rounded-xl border-2 p-4 text-left transition ${
                        formData.visibility === value
                          ? 'border-skybase-500 bg-skybase-50'
                          : 'border-skybase-200 bg-white/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 text-skybase-600 mb-2" />
                      <div className="font-medium text-skybase-900">{label}</div>
                      <div className="text-xs text-skybase-600">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2단계: 여행지 & 구간 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-skybase-900">여행지 & 구간</h2>
                <button
                  onClick={addDestination}
                  className="flex items-center gap-2 rounded-xl bg-skybase-600 px-4 py-2 text-white hover:bg-skybase-700"
                >
                  <Plus className="h-4 w-4" />
                  여행지 추가
                </button>
              </div>

              {formData.destinations.length === 0 ? (
                <div className="rounded-xl bg-skybase-50 p-8 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-skybase-400 mb-4" />
                  <p className="text-skybase-600">여행지를 추가해주세요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.destinations.map((dest, index) => (
                    <div key={index} className="rounded-xl bg-white/50 p-4 border border-skybase-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-skybase-600 text-xs text-white">
                            {index + 1}
                          </div>
                          <span className="font-medium text-skybase-900">여행지 {index + 1}</span>
                        </div>
                        {formData.destinations.length > 1 && (
                          <button
                            onClick={() => removeDestination(index)}
                            className="text-skybase-500 hover:text-skybase-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-skybase-900 mb-2">
                            여행지명 *
                          </label>
                          <input
                            type="text"
                            value={dest.name}
                            onChange={(e) => updateDestination(index, 'name', e.target.value)}
                            placeholder="예: 제주도"
                            className="w-full rounded-xl border border-skybase-200 bg-white/80 px-4 py-2 focus:border-skybase-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-skybase-900 mb-2">
                            체류 시작일
                          </label>
                          <input
                            type="date"
                            value={dest.startDate}
                            onChange={(e) => updateDestination(index, 'startDate', e.target.value)}
                            className="w-full rounded-xl border border-skybase-200 bg-white/80 px-4 py-2 focus:border-skybase-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-skybase-900 mb-2">
                            체류 종료일
                          </label>
                          <input
                            type="date"
                            value={dest.endDate}
                            onChange={(e) => updateDestination(index, 'endDate', e.target.value)}
                            className="w-full rounded-xl border border-skybase-200 bg-white/80 px-4 py-2 focus:border-skybase-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3단계: 일차 타임라인 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-skybase-900">일차 타임라인</h2>
              
              <div className="rounded-xl bg-skybase-50 p-6 text-center">
                <Clock className="mx-auto h-12 w-12 text-skybase-400 mb-4" />
                <h3 className="text-lg font-medium text-skybase-900 mb-2">
                  타임라인 기능 준비 중
                </h3>
                <p className="text-skybase-600 mb-4">
                  각 일차별 상세 일정은 여행 기록 생성 후 추가할 수 있습니다
                </p>
                <p className="text-sm text-skybase-500">
                  현재는 기본 정보와 여행지 정보만 저장됩니다
                </p>
              </div>
            </div>
          )}

          {/* 네비게이션 버튼 */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 rounded-xl bg-white/80 px-6 py-3 font-medium text-skybase-800 shadow-fluffy hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              이전
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving || !formData.startDate || !formData.endDate}
                className="rounded-xl bg-skybase-200 px-6 py-3 font-medium text-skybase-800 hover:bg-skybase-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '저장 중...' : '임시저장'}
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                  disabled={
                    (currentStep === 1 && (!formData.startDate || !formData.endDate)) ||
                    (currentStep === 2 && formData.destinations.length === 0)
                  }
                  className="flex items-center gap-2 rounded-xl bg-skybase-600 px-6 py-3 font-medium text-white shadow-fluffy hover:bg-skybase-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || !formData.startDate || !formData.endDate || formData.destinations.length === 0}
                  className="rounded-xl bg-skybase-600 px-6 py-3 font-medium text-white shadow-fluffy hover:bg-skybase-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '발행 중...' : '발행하기'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}