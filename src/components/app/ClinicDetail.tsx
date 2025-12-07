'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Globe,
  Navigation,
  Users,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { Clinic } from '@/types/clinic'
import { cn, formatDistance, getWaitTimeColor, getWaitTimeLabel, getTodayHours } from '@/lib/utils'

interface ClinicDetailProps {
  clinic: Clinic
  onBack: () => void
  onJoinQueue: () => void
  onDirections: () => void
  onCall: () => void
}

const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const dayLabels: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export function ClinicDetail({
  clinic,
  onBack,
  onJoinQueue,
  onDirections,
  onCall,
}: ClinicDetailProps) {
  const [showAllHours, setShowAllHours] = useState(false)
  const waitColor = getWaitTimeColor(clinic.waitTime)
  const waitLabel = getWaitTimeLabel(clinic.waitTime)
  const todayHours = getTodayHours(clinic.hours)

  // Get current day for highlighting
  const today = dayNames[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-neutral-50 flex flex-col max-w-[430px] mx-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-100 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-base font-semibold text-neutral-900 flex-1 truncate">
            Clinic Details
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-32">
        <div className="px-5 py-5 space-y-4">
          {/* Clinic Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {clinic.isPriority && (
                <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                  Featured
                </span>
              )}
              <div className={cn(
                'flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold',
                clinic.isOpen
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-neutral-100 text-neutral-500'
              )}>
                {clinic.isOpen && (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
                {clinic.isOpen ? 'Open Now' : 'Closed'}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 leading-tight tracking-tight">
              {clinic.name}
            </h2>
          </motion.div>

          {/* Wait Time Card */}
          <motion.div
            className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Current Wait
                </p>
                <div className={cn('text-4xl font-bold tabular-nums tracking-tight', waitColor)}>
                  ~{clinic.waitTime}
                  <span className="text-xl text-neutral-300 font-medium ml-1">min</span>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  'px-3 py-1.5 rounded-xl text-sm font-bold inline-block',
                  clinic.waitTime < 15 && 'bg-emerald-50 text-emerald-700',
                  clinic.waitTime >= 15 && clinic.waitTime < 30 && 'bg-amber-50 text-amber-700',
                  clinic.waitTime >= 30 && clinic.waitTime < 60 && 'bg-orange-50 text-orange-700',
                  clinic.waitTime >= 60 && 'bg-red-50 text-red-700'
                )}>
                  {waitLabel}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-neutral-500 justify-end">
                  <Users className="w-4 h-4" />
                  <span>{clinic.patientsInQueue} in queue</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900 mb-0.5">Address</p>
                <p className="text-sm text-neutral-500">{clinic.address}</p>
                {clinic.distance && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {formatDistance(clinic.distance)} away
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <button
              className="w-full p-4 flex items-center gap-3.5"
              onClick={() => setShowAllHours(!showAllHours)}
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-neutral-900 mb-0.5">Hours</p>
                <p className={cn(
                  'text-sm',
                  todayHours.toLowerCase() === 'closed' ? 'text-red-500' : 'text-neutral-500'
                )}>
                  Today: {todayHours}
                </p>
              </div>
              <motion.div
                animate={{ rotate: showAllHours ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {showAllHours && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-neutral-100 pt-3">
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className={cn(
                          'flex justify-between text-sm py-1',
                          day === today && 'font-semibold'
                        )}
                      >
                        <span className={cn(
                          day === today ? 'text-neutral-900' : 'text-neutral-500'
                        )}>
                          {dayLabels[day]}
                        </span>
                        <span className={cn(
                          clinic.hours[day].toLowerCase() === 'closed'
                            ? 'text-red-500'
                            : day === today
                            ? 'text-neutral-900'
                            : 'text-neutral-600'
                        )}>
                          {clinic.hours[day]}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Phone */}
            <button
              onClick={onCall}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-neutral-50 transition-colors active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-neutral-900 mb-0.5">Phone</p>
                <p className="text-sm text-neutral-500">{clinic.phone}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-neutral-300" />
            </button>

            {/* Website */}
            {clinic.website && (
              <a
                href={`https://${clinic.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-neutral-50 transition-colors active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-neutral-900 mb-0.5">Website</p>
                  <p className="text-sm text-blue-500">{clinic.website}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-neutral-300" />
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/80 backdrop-blur-xl border-t border-neutral-100 p-5 safe-bottom"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 40 }}
      >
        <div className="flex gap-3">
          <button
            onClick={onDirections}
            className="flex-1 h-14 flex items-center justify-center gap-2 bg-neutral-100 rounded-2xl text-sm font-semibold text-neutral-700 hover:bg-neutral-200 active:scale-[0.98] transition-all"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </button>
          <button
            onClick={onJoinQueue}
            disabled={!clinic.isOpen}
            className={cn(
              'flex-1 h-14 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98]',
              clinic.isOpen
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            )}
          >
            Join Queue
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
