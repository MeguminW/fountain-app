'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Navigation, ChevronRight } from 'lucide-react'
import { Clinic } from '@/types/clinic'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatDistance, getWaitTimeColor, getWaitTimeLabel } from '@/lib/utils'

interface ClinicCardProps {
  clinic: Clinic
  onSelect: (clinic: Clinic) => void
  onCheckIn: (clinic: Clinic) => void
  onDirections?: (clinic: Clinic) => void
}

export function ClinicCard({ clinic, onSelect, onCheckIn, onDirections }: ClinicCardProps) {
  const handleDirections = () => {
    if (onDirections) {
      onDirections(clinic)
    } else {
      const address = encodeURIComponent(clinic.address)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
    }
  }
  const waitColor = getWaitTimeColor(clinic.waitTime)
  const waitLabel = getWaitTimeLabel(clinic.waitTime)

  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl border border-neutral-200 p-4 cursor-pointer',
        'hover:shadow-md hover:border-neutral-300 transition-all duration-200',
        'active:scale-[0.99]',
        clinic.isPriority && 'ring-2 ring-black'
      )}
      onClick={() => onSelect(clinic)}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {clinic.isPriority && (
              <Badge className="bg-black text-white text-[10px] px-1.5 py-0">
                Featured
              </Badge>
            )}
            {clinic.isOpen ? (
              <Badge variant="success" className="text-[10px]">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse-dot" />
                Open
              </Badge>
            ) : (
              <Badge variant="error" className="text-[10px]">Closed</Badge>
            )}
          </div>
          <h3 className="font-semibold text-black text-base leading-tight line-clamp-2">
            {clinic.name}
          </h3>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-1" />
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{clinic.distance ? formatDistance(clinic.distance) : clinic.city}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className={cn('font-semibold', waitColor)}>
            ~{clinic.waitTime} min
          </span>
        </div>
      </div>

      {/* Wait Time Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'px-2.5 py-1 rounded-full text-xs font-semibold',
            clinic.waitTime < 15 && 'bg-green-50 text-green-700',
            clinic.waitTime >= 15 && clinic.waitTime < 30 && 'bg-amber-50 text-amber-700',
            clinic.waitTime >= 30 && clinic.waitTime < 60 && 'bg-orange-50 text-orange-700',
            clinic.waitTime >= 60 && 'bg-red-50 text-red-700'
          )}>
            {waitLabel}
          </div>
          <span className="text-xs text-neutral-500">
            {clinic.patientsInQueue} {clinic.patientsInQueue === 1 ? 'patient' : 'patients'} in queue
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-9"
          onClick={(e) => {
            e.stopPropagation()
            handleDirections()
          }}
        >
          <Navigation className="w-4 h-4 mr-1.5" />
          Directions
        </Button>
        <Button
          size="sm"
          className="flex-1 h-9"
          disabled={!clinic.isOpen}
          onClick={(e) => {
            e.stopPropagation()
            onCheckIn(clinic)
          }}
        >
          Check In
        </Button>
      </div>
    </motion.div>
  )
}
