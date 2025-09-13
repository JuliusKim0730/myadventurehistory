'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Edit3, 
  Camera, 
  Link,
  Save,
  Trash2,
  User
} from 'lucide-react';
import { travelService, timelineService, TravelRecord, TimelineCard } from '@/lib/firestore';


export default function TravelDetail() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [travelDetail, setTravelDetail] = useState<TravelRecord | null>(null);
  const [timeline, setTimeline] = useState<TimelineCard[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newCard, setNewCard] = useState<Partial<TimelineCard>>({
    dayNumber: 1,
    time: '',
    title: '',
    location: '',
    plan: '',
    experience: ''
  });
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadTravelData = async () => {
      if (typeof params.id === 'string') {
        try {
          const travel = await travelService.getById(params.id);
          const timelineData = await timelineService.getByTravelId(params.id);
          
          setTravelDetail(travel);
          setTimeline(timelineData);
        } catch (error) {
          console.error('여행 데이터 로딩 실패:', error);
        }
      }
    };

    if (user && params.id) {
      loadTravelData();
    }
  }, [params.id, user]);

  const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const addTimelineCard = async () => {
    if (!newCard.title || !newCard.location || !newCard.time) {
      alert('제목, 장소, 시간은 필수 입력 항목입니다.');
      return;
    }

    if (!travelDetail?.id) {
      alert('여행 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      const cardData = {
        travelId: travelDetail.id,
        dayNumber: newCard.dayNumber || 1,
        time: newCard.time || '',
        title: newCard.title || '',
        location: newCard.location || '',
        plan: newCard.plan,
        experience: newCard.experience,
        referenceUrl: newCard.referenceUrl
      };

      const cardId = await timelineService.create(cardData);
      
      if (cardId) {
        // 로컬 상태 업데이트
        const newCardWithId = { ...cardData, id: cardId };
        const updatedTimeline = [...timeline, newCardWithId].sort((a, b) => {
          if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
          return a.time.localeCompare(b.time);
        });
        setTimeline(updatedTimeline);

        setNewCard({
          dayNumber: 1,
          time: '',
          title: '',
          location: '',
          plan: '',
          experience: ''
        });
        setShowAddCard(false);
      } else {
        alert('카드 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('카드 추가 실패:', error);
      alert('카드 추가에 실패했습니다.');
    }
  };

  const deleteTimelineCard = async (cardId: string) => {
    try {
      const success = await timelineService.delete(cardId);
      if (success) {
        setTimeline(timeline.filter(card => card.id !== cardId));
      } else {
        alert('카드 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('카드 삭제 실패:', error);
      alert('카드 삭제에 실패했습니다.');
    }
  };

  const groupByDay = (timeline: TimelineCard[]) => {
    const grouped: { [key: number]: TimelineCard[] } = {};
    timeline.forEach(card => {
      if (!grouped[card.dayNumber]) {
        grouped[card.dayNumber] = [];
      }
      grouped[card.dayNumber].push(card);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
        <div className="text-blue-600 text-2xl">로딩 중...</div>
      </div>
    );
  }

  if (!user || !travelDetail) {
    return null;
  }

  const totalDays = calculateDuration(travelDetail.startDate, travelDetail.endDate);
  const groupedTimeline = groupByDay(timeline);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>돌아가기</span>
              </button>
              <h1 className="text-2xl font-bold text-blue-900 ml-6">{travelDetail.title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 size={16} />
                <span>{isEditing ? '편집 완료' : '편집하기'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 여행 정보 */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{travelDetail.title}</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{travelDetail.startDate} ~ {travelDetail.endDate}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {totalDays}일
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{travelDetail.destinations.map(dest => dest.name).join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User size={16} />
                  <span>{travelDetail.authorName}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isEditing && (
                <button
                  onClick={() => setShowAddCard(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  새 카드 추가
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 새 카드 추가 폼 */}
        {showAddCard && (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">새 타임라인 카드 추가</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">일차</label>
                <select
                  value={newCard.dayNumber}
                  onChange={(e) => setNewCard({ ...newCard, dayNumber: parseInt(e.target.value) })}
                  aria-label="여행 일차 선택"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: totalDays }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}일차</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                <input
                  type="time"
                  value={newCard.time}
                  onChange={(e) => setNewCard({ ...newCard, time: e.target.value })}
                  aria-label="시간 입력"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  placeholder="예: 아침식사, 관광지 방문"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                <input
                  type="text"
                  value={newCard.location}
                  onChange={(e) => setNewCard({ ...newCard, location: e.target.value })}
                  placeholder="구체적인 장소명"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">참고 링크 (선택)</label>
                <input
                  type="url"
                  value={newCard.referenceUrl}
                  onChange={(e) => setNewCard({ ...newCard, referenceUrl: e.target.value })}
                  placeholder="관련 웹사이트 URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계획 (선택)</label>
                <textarea
                  value={newCard.plan}
                  onChange={(e) => setNewCard({ ...newCard, plan: e.target.value })}
                  placeholder="사전에 계획했던 내용"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">실제 경험 (선택)</label>
                <textarea
                  value={newCard.experience}
                  onChange={(e) => setNewCard({ ...newCard, experience: e.target.value })}
                  placeholder="실제로 경험한 내용과 후기"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={addTimelineCard}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                저장
              </button>
            </div>
          </motion.div>
        )}

        {/* 타임라인 */}
        <div className="space-y-8">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
            <motion.div
              key={day}
              className="bg-white rounded-xl shadow-sm p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: day * 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="text-blue-500" size={20} />
                {day}일차
              </h3>

              {groupedTimeline[day] ? (
                <div className="space-y-4">
                  {groupedTimeline[day]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((card, index) => (
                    <motion.div
                      key={card.id}
                      className="border border-gray-200 rounded-lg p-6 relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {isEditing && (
                        <button
                          onClick={() => deleteTimelineCard(card.id)}
                          aria-label="타임라인 카드 삭제"
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="text-blue-600" size={16} />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-blue-600">{card.time}</span>
                            <h4 className="text-lg font-semibold text-gray-900">{card.title}</h4>
                          </div>

                          <div className="flex items-center space-x-2 text-gray-600 mb-4">
                            <MapPin size={14} />
                            <span className="text-sm">{card.location}</span>
                          </div>

                          {card.plan && (
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">계획</h5>
                              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                                {card.plan}
                              </p>
                            </div>
                          )}

                          {card.experience && (
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">실제 경험</h5>
                              <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                                {card.experience}
                              </p>
                            </div>
                          )}

                          {card.referenceUrl && (
                            <div className="mb-4">
                              <a
                                href={card.referenceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <Link size={14} />
                                <span>참고 링크</span>
                              </a>
                            </div>
                          )}

                          {card.photos && card.photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {card.photos.map((photo, photoIndex) => (
                                <img
                                  key={photoIndex}
                                  src={photo}
                                  alt={`${card.title} 사진 ${photoIndex + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>이 날의 일정이 아직 없습니다.</p>
                  {isEditing && (
                    <button
                      onClick={() => {
                        setNewCard({ ...newCard, dayNumber: day });
                        setShowAddCard(true);
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      첫 번째 일정 추가하기
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
