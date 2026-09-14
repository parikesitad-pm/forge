import React, { useState } from 'react'
import { Edit3, X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { useToast } from '@/app/providers/ToastProvider'
import { useRenameFragment } from '@/features/fragments/hooks/useFragments'
import type { FragmentDetail } from '@/types/fragment.types'

interface RenameFragmentModalProps {
  isOpen: boolean
  onClose: () => void
  fragment: FragmentDetail
}

export const RenameFragmentModal: React.FC<RenameFragmentModalProps> = ({
  isOpen,
  onClose,
  fragment,
}) => {
  const { toast } = useToast()
  const { mutateAsync: renameMutate, isPending } = useRenameFragment()
  const [title, setTitle] = useState(fragment.title || '')

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast('Title cannot be empty.', 'error')
      return
    }

    try {
      await renameMutate({ id: fragment.id, title: title.trim() })
      toast('Fragment title updated.', 'success')
      onClose()
    } catch {
      toast('Failed to rename fragment.', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100 font-serif text-lg">
            <Edit3 className="w-5 h-5 text-pink-400" />
            <span>Rename Fragment</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
              Display Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acoustic guitar lyrics"
              autoFocus
            />
            <p className="mt-2 text-[11px] text-zinc-500 font-mono leading-relaxed">
              Renaming modifies the display title only. The foundational Seed remains unchanged.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800/80">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isPending}>
              Save Title
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
