'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X, Clock, Users } from 'lucide-react'
import { Clinic } from '@/types/clinic'
import { cn, formatDistance } from '@/lib/utils'

interface HomeTabProps {
  clinics: Clinic[]
  userLocation: { lat: number; lng: number }
  onSelectClinic: (clinic: Clinic) => void
  onCheckIn: (clinic: Clinic) => void
}

type FilterType = 'all' | 'open' | 'shortest' | 'nearest'

export function HomeTab({
  clinics,
  userLocation,
  onSelectClinic,
  onCheckIn,
}: HomeTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Clinics' },
    { id: 'open', label: 'Open Now' },
    { id: 'shortest', label: 'Shortest Wait' },
    { id: 'nearest', label: 'Nearest' },
  ]

  const filteredClinics = useMemo(() => {
    let result = [...clinics]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.address.toLowerCase().includes(query) ||
          clinic.city.toLowerCase().includes(query)
      )
    }

    // Category filter
    switch (activeFilter) {
      case 'open':
        result = result.filter((c) => c.isOpen)
        break
      case 'shortest':
        result = result.sort((a, b) => {
          if (a.isPriority) return -1
          if (b.isPriority) return 1
          return a.waitTime - b.waitTime
        })
        break
      case 'nearest':
        result = result.sort((a, b) => {
          if (a.isPriority) return -1
          if (b.isPriority) return 1
          return (a.distance || 0) - (b.distance || 0)
        })
        break
      default:
        break
    }

    return result
  }, [clinics, searchQuery, activeFilter])

  const handleDirections = (clinic: Clinic) => {
    const address = encodeURIComponent(clinic.address)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-neutral-100">
        {/* Centered Brand & Location */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Fountain_WordLogo.svg"
              alt="FOUNTAIN"
              className="h-6 mx-auto mb-1"
            />
            <div className="flex items-center justify-center gap-1 text-xs text-neutral-500">
              <MapPin className="w-3 h-3" />
              <span className="font-medium">Kitchener, ON</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search clinics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-11 bg-white rounded-xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-neutral-600" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Pills - Horizontal Scroll */}
        <div className="px-5 pb-4 flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200',
                activeFilter === filter.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 active:scale-95'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Clinic List - Premium Cards */}
      <div className="flex-1 px-5 py-4 pb-28">
        <AnimatePresence mode="popLayout">
          {filteredClinics.length > 0 ? (
            <motion.div className="space-y-3">
              {filteredClinics.map((clinic, index) => (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <ClinicCardPremium
                    clinic={clinic}
                    onSelect={onSelectClinic}
                    onCheckIn={onCheckIn}
                    onDirections={handleDirections}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mb-5">
                <Search className="w-9 h-9 text-neutral-300" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                No clinics found
              </h3>
              <p className="text-sm text-neutral-500 max-w-[240px]">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Premium Clinic Card Component
function ClinicCardPremium({
  clinic,
  onSelect,
  onCheckIn,
  onDirections
}: {
  clinic: Clinic
  onSelect: (clinic: Clinic) => void
  onCheckIn: (clinic: Clinic) => void
  onDirections: (clinic: Clinic) => void
}) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-2xl overflow-hidden transition-all duration-300',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]',
        'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] active:scale-[0.99]',
        clinic.isPriority && 'ring-1 ring-neutral-900'
      )}
      onClick={() => onSelect(clinic)}
      whileTap={{ scale: 0.99 }}
    >
      <div className="p-4">
        {/* Status Row */}
        <div className="flex items-center gap-2 mb-3">
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
            {clinic.isOpen ? 'Open' : 'Closed'}
          </div>
        </div>

        {/* Clinic Name */}
        <h3 className="text-[17px] font-semibold text-neutral-900 leading-snug mb-2 line-clamp-2">
          {clinic.name}
        </h3>

        {/* Location & Distance */}
        <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>{clinic.distance ? formatDistance(clinic.distance) : clinic.city}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4">
          {/* Wait Time */}
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold',
              clinic.waitTime < 15 && 'bg-emerald-50 text-emerald-700',
              clinic.waitTime >= 15 && clinic.waitTime < 30 && 'bg-amber-50 text-amber-700',
              clinic.waitTime >= 30 && clinic.waitTime < 60 && 'bg-orange-50 text-orange-700',
              clinic.waitTime >= 60 && 'bg-red-50 text-red-700'
            )}>
              <Clock className="w-3.5 h-3.5" />
              ~{clinic.waitTime} min
            </div>
          </div>

          {/* Queue Count */}
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Users className="w-3.5 h-3.5" />
            <span>{clinic.patientsInQueue} in queue</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDirections(clinic)
            }}
            className="flex-1 h-11 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 transition-colors active:scale-[0.98]"
          >
            <MapPin className="w-4 h-4" />
            Directions
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCheckIn(clinic)
            }}
            disabled={!clinic.isOpen}
            className={cn(
              'flex-1 h-11 flex items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-[0.98]',
              clinic.isOpen
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            )}
          >
            Check In
          </button>
        </div>
      </div>
    </motion.div>
  )
}
