'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function SkyBackground({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-full w-full bg-sky-gradient overflow-hidden', className)}>
      {/* soft sun */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-yellow-200/70 blur-3xl" />

      {/* drifting clouds */}
      <motion.div
        aria-hidden
        className="absolute top-10 left-[-20%] w-[50%] h-24 bg-white/70 rounded-full blur-2xl"
        animate={{ x: ['-10%', '110%'] }}
        transition={{ duration: 70, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute top-40 left-[-30%] w-[65%] h-28 bg-white/60 rounded-full blur-2xl"
        animate={{ x: ['-30%', '120%'] }}
        transition={{ duration: 90, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute top-64 left-[-15%] w-[40%] h-20 bg-white/60 rounded-full blur-2xl"
        animate={{ x: ['-15%', '115%'] }}
        transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
      />

      {/* gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/40" />
    </div>
  )
}
