import * as React from 'react'
import { cn } from '../../lib/utils'

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'border-transparent bg-slate-900 text-white',
    primary: 'border-transparent bg-indigo-900 text-white',
    secondary: 'border-transparent bg-slate-100 text-slate-800',
    destructive: 'border-transparent bg-red-50 text-red-700 border border-red-200',
    outline: 'text-slate-800 border-slate-200',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800 border',
    warning: 'border-amber-200 bg-amber-50 text-amber-800 border',
    info: 'border-blue-200 bg-blue-50 text-blue-800 border',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
