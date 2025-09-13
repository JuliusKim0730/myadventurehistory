'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Plus, Trash2, Save } from 'lucide-react';
import { travelService } from '@/lib/firestore';

interface Destination {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
}

export default function CreateTravel() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [newDestination, setNewDestination] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const addDestination = () => {
    if (newDestination.name && newDestination.startDate && newDestination.endDate) {
      const duration = calculateDuration(newDestination.startDate, newDestination.endDate);
      const destination: Destination = {
        id: Date.now().toString(),
        name: newDestination.name,
        startDate: newDestination.startDate,
        endDate: newDestination.endDate,
        duration
      };
      setDestinations([...destinations, destination]);
      setNewDestination({ name: '', startDate: '', endDate: '' });
    }
  };

  const removeDestination = (id: string) => {
    setDestinations(destinations.filter(dest => dest.id !== id));
  };

  const handleSave = async () => {
    if (!title || !startDate || !endDate || destinations.length === 0) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    try {
      const travelData = {
        title,
        startDate,
        endDate,
        destinations,
        authorId: user.uid,
        authorName: user.displayName || '익명',
        thumbnailUrl: ''
      };

      const travelId = await travelService.create(travelData);
      
      if (travelId) {
        alert('여행 기록이 저장되었습니다!');
        router.push(`/travel/${travelId}`);
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>돌아가기</span>
            </button>
            <h1 className="text-2xl font-bold text-blue-900 ml-6">새 여행 기록</h1>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="bg-white rounded-xl shadow-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 기본 정보 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 정보</h2>
            
            {/* 여행 제목 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                여행 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 2024.03.15 제주도"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 여행 기간 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출발일
                </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="여행 출발일"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="여행 종료일"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {startDate && endDate && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Calendar size={16} />
                  <span className="font-medium">
                    총 {calculateDuration(startDate, endDate)}일 여행
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 여행지 관리 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">여행지 관리</h2>
            
            {/* 새 여행지 추가 */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">새 여행지 추가</h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    여행지명
                  </label>
                  <input
                    type="text"
                    value={newDestination.name}
                    onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                    placeholder="예: 서울, 부산, 제주도"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작일
                    </label>
                    <input
                      type="date"
                      value={newDestination.startDate}
                      onChange={(e) => setNewDestination({ ...newDestination, startDate: e.target.value })}
                      aria-label="여행지 시작일"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료일
                    </label>
                    <input
                      type="date"
                      value={newDestination.endDate}
                      onChange={(e) => setNewDestination({ ...newDestination, endDate: e.target.value })}
                      aria-label="여행지 종료일"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <button
                  onClick={addDestination}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  여행지 추가
                </button>
              </div>
            </div>

            {/* 추가된 여행지 목록 */}
            {destinations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">추가된 여행지</h3>
                {destinations.map((destination) => (
                  <motion.div
                    key={destination.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-4">
                      <MapPin className="text-blue-500" size={20} />
                      <div>
                        <h4 className="font-medium text-gray-900">{destination.name}</h4>
                        <p className="text-sm text-gray-500">
                          {destination.startDate} ~ {destination.endDate} ({destination.duration}일)
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeDestination(destination.id)}
                      aria-label="여행지 삭제"
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              여행 기록 저장
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
