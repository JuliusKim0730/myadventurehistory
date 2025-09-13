'use client'
import { motion } from 'framer-motion'
import { Plane, Ship, Car, TrainFront } from 'lucide-react'

// 교통수단 시퀀스 애니메이션 설정
const speed = 12 // 초 (한 번 화면을 가로질러 가는 시간)
const gap = 2.5  // 초 (다음 아이콘 시작 간격)

export default function TransportSequence() {
  const items = [
    { Icon: Plane, alt: '비행기', top: 80, color: 'text-blue-500' },
    { Icon: Ship, alt: '배', top: 140, color: 'text-cyan-500' },
    { Icon: Car, alt: '자동차', top: 200, color: 'text-green-500' },
    { Icon: TrainFront, alt: '기차', top: 260, color: 'text-purple-500' },
  ]

  return (
    <div className="relative mx-auto mt-8 h-[350px] w-full max-w-4xl overflow-hidden">
      {items.map((item, idx) => (
        <motion.div
          key={item.alt}
          className="absolute left-0"
          style={{ top: item.top }}
          initial={{ x: '-15%', opacity: 0 }}
          animate={{ 
            x: '115%', 
            opacity: [0, 1, 1, 1, 0] 
          }}
          transition={{
            duration: speed,
            ease: 'linear',
            repeat: Infinity,
            delay: idx * gap,
            times: [0, 0.1, 0.5, 0.9, 1]
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="flex items-center justify-center"
          >
            {/* 아이콘 사용 */}
            <div className={`rounded-2xl bg-white/70 backdrop-blur p-4 shadow-lg ${item.color}`}>
              <item.Icon size={48} />
            </div>
          </motion.div>
        </motion.div>
      ))}
      
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none" />
    </div>
  )
}
