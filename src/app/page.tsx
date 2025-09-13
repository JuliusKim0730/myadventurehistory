'use client';

import { motion } from 'framer-motion';
import { Plane, Ship, Car, Train, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { signInWithGoogle, signInAsGuest, user, loading } = useAuth();
  const router = useRouter();

  const transportIcons = [
    { Icon: Plane, delay: 0, name: 'plane' },
    { Icon: Ship, delay: 4, name: 'ship' },
    { Icon: Car, delay: 8, name: 'car' },
    { Icon: Train, delay: 12, name: 'train' },
  ];

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const handleGuestLogin = () => {
    signInAsGuest();
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 flex items-center justify-center">
        <div className="text-white text-2xl">로딩 중...</div>
      </div>
    );
  }

  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 relative overflow-hidden">
      {/* 구름 애니메이션 */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-12 bg-white rounded-full opacity-60"
            style={{
              top: `${20 + i * 15}%`,
              left: `-10%`,
            }}
            animate={{
              x: ['0vw', '110vw'],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 3,
            }}
          />
        ))}
      </div>

      {/* 교통수단 애니메이션 */}
      <div className="absolute inset-0">
        {transportIcons.map(({ Icon, delay, name }) => (
          <motion.div
            key={name}
            className="absolute text-6xl text-white/80"
            style={{
              top: `${30 + (transportIcons.indexOf({ Icon, delay, name }) * 15)}%`,
              left: '-10%',
            }}
            animate={{
              x: ['0vw', '110vw'],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'linear',
              delay: delay,
            }}
          >
            <Icon size={64} />
          </motion.div>
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-white mb-8 drop-shadow-lg">
            My Adventure History
          </h1>
          
          <motion.div
            className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="mb-4">인생을 살며, 즐겨야할 때가 있다.</p>
            <p>남들이 짠 계획이 아닌 우리만의 모험을 해보자.</p>
          </motion.div>

          {/* 로그인 버튼들 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {/* 구글 로그인 버튼 */}
            <button 
              onClick={handleGoogleLogin}
              className="w-full max-w-md mx-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full"></div>
              구글로 로그인하기
            </button>

            {/* 게스트 로그인 버튼 */}
            <button 
              onClick={handleGuestLogin}
              className="w-full max-w-md mx-auto bg-transparent hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg border-2 border-white/50 hover:border-white transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Users size={18} />
              게스트로 로그인하기
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 파도 효과 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <motion.path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="rgba(255,255,255,0.3)"
            animate={{
              d: [
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,76.44c58-10.79,114.16-20.13,172-31.86,82.39-16.72,168.19-27.73,250.45-10.39C823.78,51,906.67,82,985.66,102.83c70.05,18.48,146.53,36.09,214.34,13V0H0V47.35A600.21,600.21,0,0,0,321.39,76.44Z",
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>
    </div>
  );
}