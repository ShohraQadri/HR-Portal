import React, { createContext, useContext, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; type?: ToastMessage['type'] }) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = ({
    title,
    description,
    type = 'success',
  }: {
    title: string
    description?: string
    type?: ToastMessage['type']
  }) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: ToastMessage = { id, title, description, type }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-modal border bg-surface text-text-main animate-fade-in transition-all',
              t.type === 'success' && 'border-emerald-200 dark:border-emerald-800',
              t.type === 'error' && 'border-rose-200 dark:border-rose-800',
              t.type === 'warning' && 'border-amber-200 dark:border-amber-800',
              t.type === 'info' && 'border-blue-200 dark:border-blue-800'
            )}
          >
            {icons[t.type]}
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-semibold text-text-main">{t.title}</p>
              {t.description && <p className="text-xs text-text-secondary">{t.description}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 text-text-muted hover:text-text-main rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
