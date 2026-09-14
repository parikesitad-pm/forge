import React, { useState } from 'react'
import { FolderInput, X, ArrowRight, MessageSquare, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useFragments } from '@/features/fragments/hooks/useFragments'
import { fragmentsApi } from '@/services/api/fragmentsApi'
import { observationsApi } from '@/services/api/observationsApi'
import { queryKeys } from '@/constants/queryKeys'
import { useToast } from '@/app/providers/ToastProvider'
import { Button } from '@/components/atoms/Button'
import type { FragmentSummary } from '@/types/fragment.types'

interface MoveToFragmentModalProps {
  isOpen: boolean
  currentFragmentId?: number | string
  onClose: () => void
}

export const MoveToFragmentModal: React.FC<MoveToFragmentModalProps> = ({
  isOpen,
  currentFragmentId,
  onClose,
}) => {
  const { data: fragments } = useFragments()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  if (!isOpen) return null

  // Other fragments available as move destination
  const availableTargets = (fragments || []).filter(
    (f) => String(f.id) !== String(currentFragmentId)
  )

  const handleConfirmMove = async () => {
    if (!selectedTargetId || !currentFragmentId) return
    setIsMoving(true)

    const targetFragment = availableTargets.find((f) => f.id === selectedTargetId)
    const targetTitle = targetFragment?.seed || 'fragment tujuan'

    try {
      // 1. Fetch thoughts from current fragment
      const sourceDetail = await fragmentsApi.getById(currentFragmentId)

      // 2. Transfer user entries to destination fragment
      const userEntries = (sourceDetail.entries || []).filter((e) => e.role === 'user')
      if (userEntries.length > 0) {
        for (const entry of userEntries) {
          await observationsApi.createEntry(selectedTargetId, { content: entry.content })
        }
      }

      // 3. Mark current fragment as archived so thoughts are consolidated
      const existing: number[] = JSON.parse(
        localStorage.getItem('forge_archived_fragment_ids') || '[]'
      )
      const numericCurrentId = Number(currentFragmentId)
      if (!existing.includes(numericCurrentId)) {
        existing.push(numericCurrentId)
        localStorage.setItem('forge_archived_fragment_ids', JSON.stringify(existing))
      }

      // 4. Invalidate queries to refresh lists and fragment detail
      await queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.fragments.detail(selectedTargetId) })

      toast(`Pemikiran berhasil dipindahkan ke: "${targetTitle.slice(0, 30)}..."`, 'success')
      onClose()
      navigate(`/app/fragments/${selectedTargetId}`)
    } catch {
      toast('Gagal memindahkan fragment', 'error')
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="move-modal-title"
    >
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-100">
            <FolderInput className="w-4 h-4 text-pink-400" />
            <h2 id="move-modal-title" className="text-sm font-semibold font-mono uppercase tracking-wider">
              Move to Fragment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3 flex-1 overflow-y-auto scrollbar-thin pr-1">
          <p className="text-xs text-zinc-400 font-sans">
            Pilih fragment tujuan untuk memindahkan pemikiran dan merajut benang merah baru:
          </p>

          <div className="space-y-1.5 pt-1">
            {availableTargets.map((frag: FragmentSummary) => {
              const isSelected = selectedTargetId === frag.id
              return (
                <button
                  key={frag.id}
                  type="button"
                  onClick={() => setSelectedTargetId(frag.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-pink-500/10 border-pink-500/50 text-pink-200'
                      : 'bg-zinc-950/60 border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                    <span className="text-xs font-serif truncate">{frag.seed}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-pink-400 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isMoving}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleConfirmMove}
            disabled={!selectedTargetId || isMoving}
            isLoading={isMoving}
            className="gap-1.5"
          >
            Pindahkan <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
