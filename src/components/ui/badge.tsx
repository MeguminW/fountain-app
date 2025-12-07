'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          {
            'bg-neutral-100 text-neutral-700': variant === 'default',
            'bg-green-50 text-green-700': variant === 'success',
            'bg-amber-50 text-amber-700': variant === 'warning',
            'bg-red-50 text-red-700': variant === 'error',
            'bg-blue-50 text-blue-700': variant === 'info',
            'border border-neutral-200 text-neutral-600': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
