import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Sparkles, Gift, Flame, Feather, Compass, Star, X, Layers } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { settingsApi } from '@/services/api/settingsApi'

interface MilestoneConfig {
  id: string
  daysRequired: number
  title: string
  subtitle: string
  body: string
  icon: React.ReactNode
  accentColor: string
  visualEffect: 'pulse' | 'gather' | 'spark' | 'confetti' | 'bridge' | 'constellation'
}

const MILESTONES: MilestoneConfig[] = [
  {
    id: '3mo',
    daysRequired: 90,
    title: 'A Seed Pulsing in Quiet Soil',
    subtitle: '3 Months with Forge',
    body: 'Three months ago, you planted your first thought here. Small seeds take deep roots in silence.',
    icon: <Feather className="w-8 h-8 text-emerald-400" />,
    accentColor: 'from-emerald-500/20 to-teal-500/5',
    visualEffect: 'pulse',
  },
  {
    id: '6mo',
    daysRequired: 180,
    title: 'Fragments Gather',
    subtitle: '6 Months with Forge',
    body: 'Six months of wandering and gathering thoughts. Owl has been quietly taking note of the threads connecting them.',
    icon: <Layers className="w-8 h-8 text-amber-400" />,
    accentColor: 'from-amber-500/20 to-orange-500/5',
    visualEffect: 'gather',
  },
  {
    id: '9mo',
    daysRequired: 270,
    title: 'Fade to Spark',
    subtitle: '9 Months with Forge',
    body: 'Nine months of contemplation. When noise fades into background, only genuine sparks of clarity remain.',
    icon: <Flame className="w-8 h-8 text-orange-400" />,
    accentColor: 'from-orange-500/20 to-rose-500/5',
    visualEffect: 'spark',
  },
  {
    id: '1yr',
    daysRequired: 365,
    title: 'One Year of Wonder',
    subtitle: '1 Year with Forge',
    body: 'A full year of thinking aloud, questioning, and growing your constellation. Thank you for thinking here.',
    icon: <Sparkles className="w-8 h-8 text-amber-300" />,
    accentColor: 'from-amber-400/20 to-yellow-500/5',
    visualEffect: 'confetti',
  },
  {
    id: '18mo',
    daysRequired: 548,
    title: 'Bridging Worlds',
    subtitle: '18 Months with Forge',
    body: 'Eighteen months. Patterns emerge across time, bridging thoughts once thought distant.',
    icon: <Compass className="w-8 h-8 text-cyan-400" />,
    accentColor: 'from-cyan-500/20 to-blue-500/5',
    visualEffect: 'bridge',
  },
  {
    id: '2yr',
    daysRequired: 730,
    title: 'A Constellation Formed',
    subtitle: '2 Years with Forge',
    body: 'Two years of quiet reflection. Your thoughts now form a unique constellation, ever expanding into the unknown.',
    icon: <Star className="w-8 h-8 text-indigo-400" />,
    accentColor: 'from-indigo-500/20 to-purple-500/5',
    visualEffect: 'constellation',
  },
]

export const ForgeMomentOverlay: React.FC = () => {
  const { user, refetchUser } = useAuth()
  const [activeMoment, setActiveMoment] = useState<{
    key: string
    title: string
    subtitle: string
    body: string
    icon: React.ReactNode
    accentColor: string
    isBirthday?: boolean
    visualEffect?: string
  } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)

  // Reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Calculate days since account creation
  const daysActive = useMemo(() => {
    if (!user?.created_at) return 0
    try {
      const created = new Date(user.created_at).getTime()
      const now = Date.now()
      return Math.max(0, Math.floor((now - created) / (1000 * 60 * 60 * 24)))
    } catch {
      return 0
    }
  }, [user?.created_at])

  // Check if today is birthday
  const isBirthdayToday = useMemo(() => {
    if (user?.birthday_today) return true
    if (!user?.date_of_birth) return false
    try {
      const [, monthStr, dayStr] = user.date_of_birth.split('-')
      if (!monthStr || !dayStr) return false
      const today = new Date()
      return (
        today.getMonth() + 1 === parseInt(monthStr, 10) &&
        today.getDate() === parseInt(dayStr, 10)
      )
    } catch {
      return false
    }
  }, [user?.birthday_today, user?.date_of_birth])

  // Determine eligible moment
  const currentYear = new Date().getFullYear()
  const birthdayKey = `birthday_${currentYear}`
  const seenMilestones = useMemo(
    () => new Set(user?.seen_journey_milestones || []),
    [user?.seen_journey_milestones]
  )

  useEffect(() => {
    if (!user) return

    // Guard: Don't show if active moment already set
    if (activeMoment) return

    // Priority 1: Birthday reflection
    if (isBirthdayToday && !seenMilestones.has(birthdayKey)) {
      const callingName = user.calling_name || user.preferred_name || user.fullname || 'Thinker'
      const timer = setTimeout(() => {
        // Guard check: is user currently typing?
        const activeTag = document.activeElement?.tagName?.toLowerCase()
        if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
          return
        }
        setActiveMoment({
          key: birthdayKey,
          title: `Happy Birthday, ${callingName}!`,
          subtitle: 'A Special Day of Reflection',
          body: 'Another year of questions, wonder, and thought. May your mind stay curious and your quiet moments fruitful.',
          icon: <Gift className="w-8 h-8 text-amber-300 animate-bounce" />,
          accentColor: 'from-amber-500/20 to-rose-500/10',
          isBirthday: true,
        })
        setIsVisible(true)
      }, 3500)
      return () => clearTimeout(timer)
    }

    // Priority 2: Journey Milestones (Postponed if birthday is today)
    if (isBirthdayToday) return

    // Find the earliest unseen eligible milestone
    const eligibleMilestone = MILESTONES.find(
      (m) => daysActive >= m.daysRequired && !seenMilestones.has(m.id)
    )

    if (eligibleMilestone) {
      const timer = setTimeout(() => {
        // Guard check: typing guard
        const activeTag = document.activeElement?.tagName?.toLowerCase()
        if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
          return
        }
        setActiveMoment({
          key: eligibleMilestone.id,
          title: eligibleMilestone.title,
          subtitle: eligibleMilestone.subtitle,
          body: eligibleMilestone.body,
          icon: eligibleMilestone.icon,
          accentColor: eligibleMilestone.accentColor,
          visualEffect: eligibleMilestone.visualEffect,
        })
        setIsVisible(true)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [user, isBirthdayToday, daysActive, seenMilestones, birthdayKey, activeMoment])

  // Dismiss and persist seen milestone server-side
  const handleDismiss = useCallback(async () => {
    if (!activeMoment || isDismissing) return
    setIsDismissing(true)
    setIsVisible(false)

    try {
      await settingsApi.recordMilestone(activeMoment.key)
      await refetchUser()
    } catch {
      // Local fallback in case of network issue
    } finally {
      setTimeout(() => {
        setActiveMoment(null)
        setIsDismissing(false)
      }, 300)
    }
  }, [activeMoment, isDismissing, refetchUser])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, handleDismiss])

  if (!activeMoment || !isVisible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeMoment.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
    >
      <div className={`relative max-w-lg w-full bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden bg-gradient-to-b ${activeMoment.accentColor}`}>
        {/* Soft Background Visual Effect */}
        {!prefersReducedMotion && (
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 rounded-xl transition-colors cursor-pointer"
          aria-label="Close reflection"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-inner">
            {activeMoment.icon}
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              {activeMoment.subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif tracking-tight text-zinc-100 mt-0.5">
              {activeMoment.title}
            </h2>
          </div>
        </div>

        {/* Body Text */}
        <p className="text-sm sm:text-base text-zinc-300/90 leading-relaxed font-sans mb-6">
          {activeMoment.body}
        </p>

        {/* Milestone Visual Embellishment */}
        <div className="py-3 px-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-mono mb-6">
          <span>Thinker journey</span>
          <span className="text-zinc-200">
            {activeMoment.isBirthday ? 'Annual Milestone' : `${daysActive} days contemplative`}
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleDismiss}
            disabled={isDismissing}
            className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-md"
          >
            Continue Thinking
          </button>
        </div>
      </div>
    </div>
  )
}
