'use client'

import { Home, Map, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export type TabType = 'home' | 'map' | 'queue' | 'profile'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  hasActiveQueue?: boolean
}

const tabs = [
  { id: 'home' as const, label: 'Discover', icon: Home },
  { id: 'map' as const, label: 'Map', icon: Map },
  { id: 'queue' as const, label: 'Queue', icon: Clock },
  { id: 'profile' as const, label: 'Profile', icon: User },
]

export function BottomNav({ activeTab, onTabChange, hasActiveQueue }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-neutral-200/50" />

      {/* Content */}
      <div className="relative max-w-[430px] mx-auto">
        <div className="flex items-center justify-around h-[72px] px-2 safe-bottom">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const showBadge = tab.id === 'queue' && hasActiveQueue

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex flex-col items-center justify-center w-full h-full',
                  'transition-colors duration-200 rounded-2xl mx-1',
                  isActive ? 'text-neutral-900' : 'text-neutral-400'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute -inset-2 bg-neutral-100 rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'relative w-6 h-6 transition-all duration-200',
                      isActive && 'scale-105'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {showBadge && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40" />
                    </motion.div>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1.5 font-semibold transition-colors duration-200',
                    isActive ? 'text-neutral-900' : 'text-neutral-400'
                  )}
                >
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
