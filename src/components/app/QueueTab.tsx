'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MapPin, Navigation, X, Check, Bell, ChevronDown, Users } from 'lucide-react'
import { QueueEntry, Clinic } from '@/types/clinic'
import { cn, getEstimatedArrivalTime } from '@/lib/utils'

interface QueueTabProps {
  queueEntry: QueueEntry | null
  clinic: Clinic | null
  onLeaveQueue: () => void
  onFillIntake: () => void
  onDirections: () => void
  onFindClinics: () => void
}

export function QueueTab({
  queueEntry,
  clinic,
  onLeaveQueue,
  onFillIntake,
  onDirections,
  onFindClinics,
}: QueueTabProps) {
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [showClinicInfo, setShowClinicInfo] = useState(false)

  if (!queueEntry || !clinic) {
    // Empty State - Premium Design
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 pb-28 bg-neutral-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-24 h-24 bg-white rounded-3xl shadow-lg shadow-black/5 flex items-center justify-center mb-8 mx-auto"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          >
            <Clock className="w-12 h-12 text-neutral-300" strokeWidth={1.5} />
          </motion.div>
          <motion.h2
            className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No Active Queue
          </motion.h2>
          <motion.p
            className="text-neutral-500 mb-8 max-w-[280px] mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Find a clinic nearby and check in remotely to skip the wait.
          </motion.p>
          <motion.button
            onClick={onFindClinics}
            className="h-14 px-8 bg-neutral-900 text-white rounded-2xl font-semibold text-base hover:bg-neutral-800 active:scale-[0.98] transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Find Clinics
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Calculate progress percentage (how close to being seen)
  // If queueNumber is 5 and patientsAhead is 4, user started at position 5
  // Progress = (startPosition - patientsAhead) / startPosition * 100
  const startPosition = queueEntry.queueNumber
  const progressPercentage = startPosition > 0
    ? Math.min(100, ((startPosition - queueEntry.patientsAhead) / startPosition) * 100)
    : 0

  // Status configuration
  const getStatusConfig = () => {
    switch (queueEntry.status) {
      case 'almost':
        return {
          title: 'Almost Your Turn',
          subtitle: 'Please head to the clinic now',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: Bell,
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
        }
      case 'ready':
        return {
          title: "It's Your Turn!",
          subtitle: 'Please proceed to the front desk',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          icon: Check,
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
        }
      default:
        return {
          title: "You're in the queue",
          subtitle: "We'll notify you when it's almost your turn",
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: Clock,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        }
    }
  }

  const status = getStatusConfig()
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-neutral-50 pb-28">
      {/* Header */}
      <motion.header
        className="bg-white px-5 pt-5 pb-4 border-b border-neutral-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Currently at
            </p>
            <h1 className="text-lg font-bold text-neutral-900 leading-snug">
              {queueEntry.clinicName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Live
            </span>
          </div>
        </div>
      </motion.header>

      <div className="px-5 py-5 space-y-4">
        {/* Main Queue Card */}
        <motion.div
          className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Queue Number */}
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Your Number
            </p>
            <motion.div
              className="text-7xl font-bold text-neutral-900 tabular-nums tracking-tighter"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {queueEntry.queueNumber}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-100 my-6" />

          {/* Wait Time */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-neutral-900 tabular-nums tracking-tight">
                ~{queueEntry.estimatedWait}
              </span>
              <span className="text-xl text-neutral-400 font-medium">min</span>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Est. arrival: {getEstimatedArrivalTime(queueEntry.estimatedWait)}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 font-medium">Patients ahead</span>
              <span className="text-neutral-900 font-bold tabular-nums">
                {queueEntry.patientsAhead}
              </span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neutral-900 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          className={cn(
            'rounded-2xl p-4 border',
            status.bg,
            status.border
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', status.iconBg)}>
              <StatusIcon className={cn('w-5 h-5', status.iconColor)} />
            </div>
            <div>
              <p className={cn('text-sm font-bold', status.text)}>
                {status.title}
              </p>
              <p className={cn('text-xs font-medium opacity-80', status.text)}>
                {status.subtitle}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Intake Form Card */}
        <motion.div
          className={cn(
            'rounded-2xl p-4',
            queueEntry.intakeCompleted
              ? 'bg-emerald-50 border border-emerald-100'
              : 'bg-white border border-neutral-200'
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {queueEntry.intakeCompleted ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Intake Complete</p>
                <p className="text-xs text-emerald-700">Your information is ready</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <span className="text-white font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">Complete Intake</p>
                  <p className="text-xs text-neutral-500">Save time at check-in</p>
                </div>
              </div>
              <button
                onClick={onFillIntake}
                className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 active:scale-95 transition-all"
              >
                Fill Now
              </button>
            </div>
          )}
        </motion.div>

        {/* Clinic Info Accordion */}
        <motion.div
          className="bg-white rounded-2xl overflow-hidden border border-neutral-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setShowClinicInfo(!showClinicInfo)}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          >
            <span className="text-sm font-semibold text-neutral-900">Clinic Details</span>
            <motion.div
              animate={{ rotate: showClinicInfo ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {showClinicInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-neutral-100 pt-3">
                  <div className="flex items-center gap-2.5 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span>{clinic.address}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onDirections}
            className="flex-1 h-14 flex items-center justify-center gap-2 bg-white border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-[0.98] transition-all"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </button>
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="flex-1 h-14 flex items-center justify-center gap-2 bg-white border border-red-200 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all"
          >
            <X className="w-4 h-4" />
            Leave Queue
          </button>
        </motion.div>
      </div>

      {/* Leave Queue Confirmation Modal */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLeaveConfirm(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-white rounded-t-3xl w-full max-w-[430px] p-6 pb-10"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Leave Queue?</h3>
              <p className="text-neutral-500 mb-8 leading-relaxed">
                Are you sure you want to leave? You'll lose your position and will need to check in again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 h-14 bg-neutral-100 rounded-2xl text-sm font-semibold text-neutral-700 hover:bg-neutral-200 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLeaveConfirm(false)
                    onLeaveQueue()
                  }}
                  className="flex-1 h-14 bg-red-500 rounded-2xl text-sm font-semibold text-white hover:bg-red-600 active:scale-[0.98] transition-all"
                >
                  Leave Queue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
