'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  variant?: 'icon' | 'wordmark' | 'combined'
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const sizes = {
  icon: {
    xs: { width: 24, height: 24 },
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 56, height: 56 },
  },
  wordmark: {
    xs: { width: 80, height: 20 },
    sm: { width: 100, height: 25 },
    md: { width: 120, height: 30 },
    lg: { width: 160, height: 40 },
  },
  combined: {
    xs: { width: 100, height: 28 },
    sm: { width: 120, height: 34 },
    md: { width: 140, height: 40 },
    lg: { width: 180, height: 52 },
  },
}

export function Logo({ variant = 'combined', className, size = 'md' }: LogoProps) {
  const dimensions = sizes[variant][size]

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Image
          src="/fountain-logo-icon.png"
          alt="Fountain"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="select-none object-contain"
        />
      </div>
    )
  }

  if (variant === 'wordmark') {
    // For wordmark, we use the combined logo but crop to just show text portion
    return (
      <div className={cn('flex items-center', className)}>
        <Image
          src="/fountain-logo-full.png"
          alt="Fountain"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="select-none object-contain"
        />
      </div>
    )
  }

  // Combined: Icon + Wordmark - use the full logo
  return (
    <div className={cn('flex items-center', className)}>
      <Image
        src="/fountain-logo-full.png"
        alt="Fountain Health Technologies"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="select-none object-contain"
      />
    </div>
  )
}
