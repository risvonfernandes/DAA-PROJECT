import * as React from 'react'
import { useToast } from './use-toast'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (!toasts.length) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2 pointer-events-none"
    >
      {toasts.map(({ id, title, description, variant }) => {
        const isSuccess = variant === 'success'
        const isDestructive = variant === 'destructive'
        const isWarning = variant === 'warning'

        const Icon = isSuccess
          ? CheckCircle2
          : isDestructive
          ? AlertCircle
          : isWarning
          ? AlertTriangle
          : Info

        return (
          <div
            key={id}
            role="alert"
            className={cn(
              'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-200',
              isSuccess && 'border-emerald-200 bg-white text-slate-800 shadow-emerald-500/5',
              isDestructive && 'border-red-200 bg-white text-slate-800 shadow-red-500/5',
              isWarning && 'border-amber-200 bg-white text-slate-800 shadow-amber-500/5',
              !isSuccess && !isDestructive && !isWarning && 'border-slate-200 bg-white text-slate-800'
            )}
          >
            <div
              className={cn(
                'mt-0.5 rounded-md p-1 shrink-0',
                isSuccess && 'bg-emerald-50 text-emerald-600',
                isDestructive && 'bg-red-50 text-red-600',
                isWarning && 'bg-amber-50 text-amber-600',
                !isSuccess && !isDestructive && !isWarning && 'bg-indigo-50 text-indigo-700'
              )}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div className="grid gap-1 flex-1 text-sm">
              {title && <div className="font-semibold text-slate-900 leading-snug">{title}</div>}
              {description && <div className="text-xs text-slate-600 leading-relaxed">{description}</div>}
            </div>

            <button
              onClick={() => dismiss(id)}
              className="rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-950"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
