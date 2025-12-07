'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'success'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.98]',
          {
            'bg-black text-white hover:bg-neutral-800': variant === 'default',
            'border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700':
              variant === 'outline',
            'hover:bg-neutral-100 text-neutral-700': variant === 'ghost',
            'bg-error text-white hover:bg-red-600': variant === 'destructive',
            'bg-success text-white hover:bg-green-600': variant === 'success',
          },
          {
            'h-10 px-4 text-sm': size === 'default',
            'h-8 px-3 text-xs': size === 'sm',
            'h-12 px-6 text-base': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
