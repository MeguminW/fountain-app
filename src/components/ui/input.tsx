'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-lg border bg-white px-4 text-base',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-neutral-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200',
          error
            ? 'border-error focus-visible:ring-error'
            : 'border-neutral-200',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
