'use client'

import { motion } from 'framer-motion'
import {
  User,
  CreditCard,
  Pill,
  Heart,
  Building2,
  Bell,
  Globe,
  ChevronRight,
  Clock,
  LogOut,
} from 'lucide-react'
import { UserProfile } from '@/types/clinic'
import { cn } from '@/lib/utils'

interface ProfileTabProps {
  profile: UserProfile | null
  onEditProfile: () => void
  onViewHistory: () => void
  onToggleNotifications: () => void
  onChangeLanguage: () => void
}

export function ProfileTab({
  profile,
  onEditProfile,
  onViewHistory,
  onToggleNotifications,
  onChangeLanguage,
}: ProfileTabProps) {

  const healthItems = [
    {
      id: 'personal',
      icon: User,
      label: 'Personal Information',
      value: profile?.fullName || 'Not set',
      onClick: onEditProfile,
    },
    {
      id: 'health-card',
      icon: CreditCard,
      label: 'Health Card',
      value: profile?.healthCard ? '••••' + profile.healthCard.slice(-4) : 'Not added',
      hasValue: !!profile?.healthCard,
      onClick: onEditProfile,
    },
    {
      id: 'allergies',
      icon: Heart,
      label: 'Allergies',
      value: profile?.allergies || 'None listed',
      onClick: onEditProfile,
    },
    {
      id: 'medications',
      icon: Pill,
      label: 'Medications',
      value: profile?.medications || 'None listed',
      onClick: onEditProfile,
    },
    {
      id: 'pharmacy',
      icon: Building2,
      label: 'Preferred Pharmacy',
      value: profile?.preferredPharmacy || 'Not set',
      onClick: onEditProfile,
    },
  ]

  const settingsItems = [
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      value: profile?.notificationsEnabled ? 'On' : 'Off',
      onClick: onToggleNotifications,
      toggle: true,
      toggleValue: profile?.notificationsEnabled,
    },
    {
      id: 'language',
      icon: Globe,
      label: 'Language',
      value: profile?.language === 'en' ? 'English' : 'Français',
      onClick: onChangeLanguage,
    },
    {
      id: 'history',
      icon: Clock,
      label: 'Visit History',
      value: '',
      onClick: onViewHistory,
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 pb-28">
      {/* Profile Header */}
      <motion.header
        className="bg-white px-5 pt-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <motion.div
            className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-2xl font-bold text-white tracking-tight">
              {profile?.fullName
                ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                : 'U'}
            </span>
          </motion.div>
          <div className="flex-1">
            <motion.h1
              className="text-xl font-bold text-neutral-900 tracking-tight"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {profile?.fullName || 'Demo User'}
            </motion.h1>
            <motion.p
              className="text-sm text-neutral-500 font-medium mt-0.5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {profile?.phone || '(519) 123-4567'}
            </motion.p>
          </div>
        </div>
      </motion.header>

      <div className="px-5 py-5 space-y-5">
        {/* Health Information Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Health Information
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {healthItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  className={cn(
                    'w-full px-4 py-4 flex items-center gap-3.5 hover:bg-neutral-50 transition-colors active:bg-neutral-100',
                    index !== healthItems.length - 1 && 'border-b border-neutral-100'
                  )}
                  onClick={item.onClick}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[15px] font-semibold text-neutral-900">{item.label}</p>
                    <p className="text-sm text-neutral-500 truncate">{item.value}</p>
                  </div>
                  {item.hasValue && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-md">
                      Saved
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        {/* Settings Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Settings
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {settingsItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  className={cn(
                    'w-full px-4 py-4 flex items-center gap-3.5 hover:bg-neutral-50 transition-colors active:bg-neutral-100',
                    index !== settingsItems.length - 1 && 'border-b border-neutral-100'
                  )}
                  onClick={item.onClick}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.03 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[15px] font-semibold text-neutral-900">{item.label}</p>
                    {item.value && (
                      <p className="text-sm text-neutral-500">{item.value}</p>
                    )}
                  </div>
                  {item.toggle ? (
                    <div
                      className={cn(
                        'w-12 h-7 rounded-full transition-colors relative',
                        item.toggleValue ? 'bg-neutral-900' : 'bg-neutral-200'
                      )}
                    >
                      <motion.div
                        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                        animate={{ left: item.toggleValue ? 26 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        {/* Sign Out */}
        <motion.button
          className="w-full py-4 flex items-center justify-center gap-2 text-neutral-400 hover:text-red-500 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Sign Out</span>
        </motion.button>

        {/* Version */}
        <motion.p
          className="text-xs text-neutral-300 text-center pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Fountain v1.0.0
        </motion.p>
      </div>
    </div>
  )
}
