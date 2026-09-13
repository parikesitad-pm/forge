import React from 'react'
import { NeuralCanvas } from '@/features/landing/components/NeuralCanvas'
import { LandingNavbar } from '@/features/landing/components/LandingNavbar'
import { LandingHero } from '@/features/landing/components/LandingHero'
import { CaptureDemo } from '@/features/landing/components/CaptureDemo'
import { EvolutionSection } from '@/features/landing/components/EvolutionSection'
import { OwlSection } from '@/features/landing/components/OwlSection'
import { SparksSection } from '@/features/landing/components/SparksSection'
import { GrowthSection } from '@/features/landing/components/GrowthSection'
import { PhilosophySection } from '@/features/landing/components/PhilosophySection'
import { LandingFooter } from '@/features/landing/components/LandingFooter'

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 selection:bg-pink-500/30 selection:text-pink-200">
      <NeuralCanvas />
      <LandingNavbar />
      <main>
        <LandingHero />
        <CaptureDemo />
        <EvolutionSection />
        <OwlSection />
        <SparksSection />
        <GrowthSection />
        <PhilosophySection />
      </main>
      <LandingFooter />
    </div>
  )
}
