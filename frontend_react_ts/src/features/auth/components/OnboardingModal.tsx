import React, { useState } from 'react'
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { settingsApi } from '@/services/api/settingsApi'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: () => void
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { user, refetchUser } = useAuth()
  const { toast } = useToast()

  const [step, setStep] = useState<1 | 2>(1)
  const [displayName, setDisplayName] = useState(user?.fullname || user?.username || '')
  const [interests, setInterests] = useState(user?.bio || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) return
    setStep(2)
  }

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await settingsApi.updateProfile({
        fullname: displayName.trim(),
        bio: interests.trim(),
      })
      await refetchUser()
      sessionStorage.removeItem('forge_show_onboarding')
      toast('Ruang berpikirmu siap. Selamat datang di Forge.', 'success')
      onComplete()
    } catch {
      toast('Gagal menyimpan profil onboarding', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step indicator */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-6">
          <div className="flex items-center gap-1.5 text-pink-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Forge Welcome</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={step === 1 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>1</span>
            <span>/</span>
            <span className={step === 2 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>2</span>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="space-y-2">
              <h2 id="onboarding-modal-title" className="text-xl sm:text-2xl font-serif text-zinc-100 font-medium">
                Mau dipanggil siapa?
              </h2>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Pilih nama panggilan atau alias yang nyaman untuk ruang berpikir pribadimu.
              </p>
            </div>

            <div>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Contoh: Alex, Raden, atau nama penamu"
                autoFocus
                className="text-base"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!displayName.trim()}
              className="w-full gap-2 rounded-xl"
            >
              Lanjut <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFinish} className="space-y-6">
            <div className="space-y-2">
              <h2 id="onboarding-modal-title" className="text-xl sm:text-2xl font-serif text-zinc-100 font-medium">
                Interest atau topik apa yang lagi kamu pikirin?
              </h2>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Owl akan memperhatikan caramu menyusun ide di sekitar topik-topik ini.
              </p>
            </div>

            <div>
              <textarea
                rows={4}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Contoh: Arsitektur software, filsafat stoik, creative writing, riset AI..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm outline-none focus:border-pink-500 font-serif leading-relaxed"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setStep(1)}
                className="gap-1.5 text-zinc-400 hover:text-zinc-200"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="flex-1 rounded-xl gap-2"
              >
                Mulai Berpikir ✦
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
