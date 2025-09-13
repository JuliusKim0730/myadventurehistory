'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Plus, MapPin, Calendar, User } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut, loading, isGuest } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">My Adventure History</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-gray-700">
                  {user.displayName || '게스트'}
                  {isGuest && <span className="text-xs text-blue-500 ml-1">(게스트)</span>}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 환영 섹션 */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              환영합니다, {user.displayName || '여행자'}님! 🌟
            </h2>
            <p className="text-gray-600 mb-6">
              특별한 여행의 순간들을 기록하고 추억을 만들어보세요.
            </p>
            
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/create')}
            >
              <Plus size={20} />
              새로운 여행 기록하기
            </motion.button>
          </div>
        </motion.div>

        {/* 네비게이션 카드들 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 나의 여행 기록 */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => router.push('/my-travels')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">나의 여행 기록</h3>
              <MapPin className="text-blue-500" size={24} />
            </div>
            <p className="text-gray-600 mb-4">
              내가 다녀온 특별한 여행들을 확인하고 관리해보세요.
            </p>
            <div className="text-sm text-blue-600 font-medium">
              바로가기 →
            </div>
          </motion.div>

          {/* 모든 여행 기록 */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => router.push('/explore')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">모든 여행 기록</h3>
              <Calendar className="text-green-500" size={24} />
            </div>
            <p className="text-gray-600 mb-4">
              다른 여행자들의 멋진 여행 이야기를 둘러보세요.
            </p>
            <div className="text-sm text-green-600 font-medium">
              둘러보기 →
            </div>
          </motion.div>

          {/* 여행 계획하기 */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => router.push('/create')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">새 여행 계획</h3>
              <Plus className="text-purple-500" size={24} />
            </div>
            <p className="text-gray-600 mb-4">
              새로운 모험을 계획하고 기록을 시작해보세요.
            </p>
            <div className="text-sm text-purple-600 font-medium">
              시작하기 →
            </div>
          </motion.div>
        </div>

        {/* 최근 활동 */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">최근 활동</h3>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500">
              아직 여행 기록이 없습니다. 첫 번째 여행을 기록해보세요!
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
