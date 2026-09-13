import React, { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export type ToastVariant = 'success' | 'warning' | 'error' | 'info'

export interface ToastMessage {
  id: string
  title?: string
  message: string
  variant: ToastVariant
}

interface ToastContextType {
  toast: (message: string, variant?: ToastVariant, title?: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', title?: string) => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((prev) => [...prev, { id, message, variant, title }])

      setTimeout(() => {
        removeToast(id)
      }, 4000)
    },
    [removeToast]
  )

  const success = useCallback((msg: string, title?: string) => toast(msg, 'success', title), [toast])
  const error = useCallback((msg: string, title?: string) => toast(msg, 'error', title), [toast])
  const info = useCallback((msg: string, title?: string) => toast(msg, 'info', title), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${
                t.variant === 'success'
                  ? 'bg-zinc-900/90 border-emerald-500/30 text-emerald-200'
                  : t.variant === 'error'
                  ? 'bg-zinc-900/90 border-rose-500/30 text-rose-200'
                  : t.variant === 'warning'
                  ? 'bg-zinc-900/90 border-amber-500/30 text-amber-200'
                  : 'bg-zinc-900/90 border-zinc-700/50 text-zinc-200'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {t.variant === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {t.variant === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {t.variant === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                {t.variant === 'info' && <Info className="w-4 h-4 text-pink-400" />}
              </div>
              <div className="flex-1 min-w-0">
                {t.title && <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">{t.title}</p>}
                <p className="text-xs leading-relaxed text-zinc-300">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
