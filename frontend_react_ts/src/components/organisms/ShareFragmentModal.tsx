import React, { useState } from 'react'
import { Share2, Copy, Check, Globe, X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { useToast } from '@/app/providers/ToastProvider'
import { useShareFragment, useRevokeShareFragment } from '@/features/fragments/hooks/useFragments'
import type { FragmentDetail } from '@/types/fragment.types'

interface ShareFragmentModalProps {
  isOpen: boolean
  onClose: () => void
  fragment: FragmentDetail
}

export const ShareFragmentModal: React.FC<ShareFragmentModalProps> = ({
  isOpen,
  onClose,
  fragment,
}) => {
  const { toast } = useToast()
  const { mutateAsync: shareMutate, isPending: isSharing } = useShareFragment()
  const { mutateAsync: revokeMutate, isPending: isRevoking } = useRevokeShareFragment()
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const publicUrl = fragment.public_url ? `${origin}${fragment.public_url}` : null

  const handleCreateShare = async () => {
    try {
      await shareMutate(fragment.id)
      toast('Public share link created.', 'success')
    } catch {
      toast('Failed to create share link.', 'error')
    }
  }

  const handleRevokeShare = async () => {
    try {
      await revokeMutate(fragment.id)
      toast('Share link revoked. This thought is private again.', 'info')
    } catch {
      toast('Failed to revoke share link.', 'error')
    }
  }

  const handleCopyLink = async () => {
    if (!publicUrl) return
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      toast('Link copied to clipboard.', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Failed to copy link.', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100 font-serif text-lg">
            <Share2 className="w-5 h-5 text-pink-400" />
            <span>Share Fragment</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Privacy Explanation */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>
              {fragment.shared ? 'Public Read-Only Link Active' : 'Private Thought Fragment'}
            </span>
          </div>
          <p>
            Public visitors can only read this specific thought fragment, its evolution, and kept
            sparks. They cannot access your other fragments, account details, or private settings.
          </p>
        </div>

        {fragment.shared && publicUrl ? (
          <div className="space-y-3">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Public Link
            </label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-transparent text-xs text-zinc-300 font-mono focus:outline-none px-2 select-all truncate"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0 flex items-center gap-1 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Button
                variant="danger"
                size="sm"
                isLoading={isRevoking}
                onClick={handleRevokeShare}
                className="text-xs"
              >
                Revoke Link
              </Button>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-zinc-400">
              Sharing is currently <strong>disabled</strong> for this fragment.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSharing}
                onClick={handleCreateShare}
              >
                Create Public Link
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
