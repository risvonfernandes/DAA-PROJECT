import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'

const buttonVariants = ({
  variant = 'default',
  size = 'default',
  className = '',
} = {}) => {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none'

  const variants = {
    default: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:bg-slate-950',
    primary: 'bg-indigo-900 text-white shadow-sm hover:bg-indigo-950 active:bg-slate-950',
    destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
    outline: 'border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 text-slate-700',
    secondary: 'bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200',
    ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
    link: 'text-indigo-900 underline-offset-4 hover:underline',
    success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
  }

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-lg px-6 text-sm',
    icon: 'h-9 w-9',
    'icon-sm': 'h-7 w-7 rounded-md',
  }

  return cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)
}

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, disabled, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
