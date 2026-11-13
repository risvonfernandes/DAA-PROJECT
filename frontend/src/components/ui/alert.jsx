import * as React from 'react'
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

const Alert = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
  const isDestructive = variant === 'destructive' || variant === 'error'
  const isSuccess = variant === 'success' || variant === 'ok'
  const isWarning = variant === 'warning' || variant === 'warn'

  const Icon = isDestructive
    ? AlertCircle
    : isSuccess
    ? CheckCircle2
    : isWarning
    ? AlertTriangle
    : Info

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
        isDestructive && 'border-red-200 bg-red-50 text-red-900',
        isSuccess && 'border-emerald-200 bg-emerald-50 text-emerald-900',
        isWarning && 'border-amber-200 bg-amber-50 text-amber-900',
        !isDestructive && !isSuccess && !isWarning && 'border-slate-200 bg-slate-50 text-slate-800',
        className
      )}
      {...props}
    >
      <Icon
        className={cn(
          'h-5 w-5 shrink-0 mt-0.5',
          isDestructive && 'text-red-600',
          isSuccess && 'text-emerald-600',
          isWarning && 'text-amber-600',
          !isDestructive && !isSuccess && !isWarning && 'text-slate-600'
        )}
      />
      <div className="flex-1">{children}</div>
    </div>
  )
})
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed text-slate-600', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
