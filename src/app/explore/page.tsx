'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, User, Heart, MessageCircle, Share2 } from 'lucide-react';
import { travelService, TravelRecord } from '@/lib/firestore';
import Image from 'next/image';

// 기간 계산 함수
const calculateDuration = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export default function Explore() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [travelRecords, setTravelRecords] = useState<TravelRecord[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadTravelRecords = async () => {
      try {
        const records = await travelService.getAll();
        setTravelRecords(records);
      } catch (error) {
        console.error('여행 기록 로딩 실패:', error);
      }
    };

    if (user) {
      loadTravelRecords();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
        <div className="text-blue-600 text-2xl">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>돌아가기</span>
            </button>
            <h1 className="text-2xl font-bold text-blue-900 ml-6">모든 여행 기록</h1>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 필터/검색 영역 */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="여행지나 제목으로 검색..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select 
                aria-label="여행 기간 필터"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">모든 기간</option>
                <option value="1-3">1-3일</option>
                <option value="4-7">4-7일</option>
                <option value="8+">8일 이상</option>
              </select>
              <select 
                aria-label="정렬 방식"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">최신순</option>
                <option value="popular">인기순</option>
                <option value="duration">기간순</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* 여행 기록 카드들 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelRecords.map((record, index) => (
            <motion.div
              key={record.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => router.push(`/travel/${record.id}`)}
            >
              {/* 썸네일 이미지 */}
              <div className="aspect-video bg-gray-200 relative">
                {record.thumbnailUrl ? (
                  <Image
                    src={record.thumbnailUrl}
                    alt={record.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-200">
                    <MapPin className="text-blue-500" size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                  {calculateDuration(record.startDate, record.endDate)}일
                </div>
              </div>

              {/* 카드 내용 */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {record.title}
                </h3>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar size={14} />
                  <span>{record.startDate} ~ {record.endDate}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <MapPin size={14} />
                  <span>{record.destinations.map(dest => dest.name).join(', ')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{record.authorName}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart size={12} />
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={12} />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 호버 시 나타나는 액션 버튼들 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: 좋아요 기능
                  }}
                  aria-label="좋아요"
                  className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Heart size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: 공유 기능
                  }}
                  aria-label="공유하기"
                  className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 빈 상태 */}
        {travelRecords.length === 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 여행 기록이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              첫 번째 여행 기록을 작성해보세요!
            </p>
            <button
              onClick={() => router.push('/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              여행 기록 작성하기
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
