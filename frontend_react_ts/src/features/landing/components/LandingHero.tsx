import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Compass } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'

export const LandingHero: React.FC = () => {
  return (
    <section className="relative z-10 pt-24 pb-20 md:pt-32 md:pb-28 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="owl" className="mb-8 px-3.5 py-1 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
          A Thinking Companion &middot; Modula Project
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-zinc-100 font-serif leading-[1.15] max-w-3xl"
      >
        Some thoughts deserve to exist <br className="hidden sm:inline" />
        <span className="italic text-zinc-300 font-serif">before they make sense.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed"
      >
        Forge is a quiet creative journal for capturing unfinished thoughts, exploring them with
        Owl, and noticing what may be starting to take shape.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link to="/register">
          <Button variant="primary" size="lg" className="px-8 shadow-lg shadow-pink-600/20">
            Start Thinking <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
        <a href="#how-it-works">
          <Button variant="secondary" size="lg" className="px-6">
            <Compass className="w-4 h-4 mr-1 text-zinc-400" /> See how Forge works
          </Button>
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 text-xs text-zinc-500 uppercase tracking-widest font-mono"
      >
        Capture first. Understand later.
      </motion.p>
    </section>
  )
}
