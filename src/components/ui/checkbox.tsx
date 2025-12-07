'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 shrink-0 rounded border-2 transition-all duration-200 cursor-pointer',
            'flex items-center justify-center',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-2',
            checked
              ? 'bg-black border-black'
              : 'bg-white border-neutral-300 hover:border-neutral-400',
            className
          )}
          onClick={() => onCheckedChange?.(!checked)}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
