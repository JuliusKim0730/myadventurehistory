'use client'
import SkyBackground from '@/components/SkyBackground'
import SplashHero from '@/components/SplashHero'
import { motion } from 'framer-motion'

export default function Page() {
  return (
    <main className="relative min-h-dvh">
      <SkyBackground className="absolute inset-0" />

      <section className="relative z-10 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SplashHero />
        </motion.div>
      </section>

      {/* footer note */}
      <footer className="relative z-10 pb-8 text-center text-xs text-skybase-900/70">
        © {new Date().getFullYear()} My Adventure History
      </footer>
    </main>
  )
}