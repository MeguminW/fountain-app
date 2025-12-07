'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, MapPin, Navigation, Locate, Users } from 'lucide-react'
import { Clinic } from '@/types/clinic'
import { cn, formatDistance, getWaitTimeColor } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)


interface MapTabProps {
  clinics: Clinic[]
  userLocation: { lat: number; lng: number }
  onSelectClinic: (clinic: Clinic) => void
  onCheckIn: (clinic: Clinic) => void
}

export function MapTab({ clinics, userLocation, onSelectClinic, onCheckIn }: MapTabProps) {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mapReady, setMapReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userIcon, setUserIcon] = useState<any>(null)

  // Initialize Leaflet icons on client side
  useEffect(() => {
    import('leaflet').then((L) => {
      // Fix default marker icon issue
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // User location icon (blue dot)
      const userMarker = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: 0; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 4px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      setUserIcon(userMarker)
      setMapReady(true)

      // Trigger resize after map is ready to fix tile display
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 200)
    })
  }, [])

  // Create dynamic clinic icon with wait time
  const createClinicIcon = (clinic: Clinic, isSelected: boolean) => {
    if (typeof window === 'undefined') return null

    const L = require('leaflet')
    const bgColor = isSelected ? '#171717' : 'white'
    const textColor = isSelected ? 'white' : (clinic.waitTime < 30 ? '#171717' : '#EA580C')
    const scale = isSelected ? 'transform: scale(1.1);' : ''
    const shadow = isSelected ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.15)'

    return L.divIcon({
      className: isSelected ? 'clinic-marker-selected' : 'clinic-marker',
      html: `
        <div style="background: ${bgColor}; color: ${textColor}; padding: 6px 10px; border-radius: 12px; box-shadow: ${shadow}; font-weight: 700; font-size: 12px; white-space: nowrap; display: flex; align-items: center; gap: 4px; ${scale}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${clinic.waitTime}m</span>
        </div>
        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${bgColor}; margin: -1px auto 0;"></div>
      `,
      iconSize: [60, 36],
      iconAnchor: [30, 36],
    })
  }

  const handleMarkerClick = (clinic: Clinic) => {
    setSelectedClinic(clinic)
  }

  const handleDirections = (clinic: Clinic) => {
    const address = encodeURIComponent(clinic.address)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
  }

  // Filter clinics by search
  const filteredClinics = searchQuery
    ? clinics.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clinics

  return (
    <div className="flex flex-col h-screen bg-neutral-100 relative overflow-hidden">
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search on map..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-11 bg-white rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 shadow-lg shadow-black/5 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-neutral-600" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Real Map Container */}
      <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {mapReady && userIcon ? (
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            zoomControl={false}
          >
            {/* OpenStreetMap Tiles - Clean Style */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* User Location Marker */}
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            />

            {/* User Location Accuracy Circle */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={100}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 1,
              }}
            />

            {/* Clinic Markers */}
            {filteredClinics.map((clinic) => {
              const icon = createClinicIcon(clinic, selectedClinic?.id === clinic.id)
              if (!icon) return null

              return (
                <Marker
                  key={clinic.id}
                  position={[clinic.latitude, clinic.longitude]}
                  icon={icon}
                  eventHandlers={{
                    click: () => handleMarkerClick(clinic),
                  }}
                />
              )
            })}
          </MapContainer>
        ) : (
          // Loading state
          <div className="flex-1 flex items-center justify-center bg-neutral-100">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-neutral-500 font-medium">Loading map...</p>
            </div>
          </div>
        )}

        {/* Center on User Button */}
        <motion.button
          className="absolute bottom-32 right-4 z-[1000] w-12 h-12 bg-white rounded-2xl shadow-lg shadow-black/10 flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all"
          onClick={() => {
            // Map will re-center when userLocation changes
            console.log('Center on user:', userLocation)
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Locate className="w-5 h-5 text-neutral-700" />
        </motion.button>
      </div>

      {/* Selected Clinic Card */}
      <AnimatePresence>
        {selectedClinic && (
          <motion.div
            className="absolute bottom-24 left-4 right-4 z-[1000]"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">
              {/* Handle */}
              <button
                className="w-full py-2.5 flex items-center justify-center"
                onClick={() => setSelectedClinic(null)}
              >
                <div className="w-10 h-1 bg-neutral-200 rounded-full" />
              </button>

              <div className="px-5 pb-5">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={cn(
                        'flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold',
                        selectedClinic.isOpen
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-neutral-100 text-neutral-500'
                      )}>
                        {selectedClinic.isOpen && (
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        )}
                        {selectedClinic.isOpen ? 'Open' : 'Closed'}
                      </div>
                    </div>
                    <h3 className="font-semibold text-neutral-900 text-[17px] leading-snug">
                      {selectedClinic.name}
                    </h3>
                  </div>
                  <div className="text-right pl-4">
                    <div className={cn(
                      'text-2xl font-bold tabular-nums',
                      getWaitTimeColor(selectedClinic.waitTime)
                    )}>
                      ~{selectedClinic.waitTime}
                    </div>
                    <div className="text-xs text-neutral-500 font-medium">min wait</div>
                  </div>
                </div>

                {/* Info Row */}
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedClinic.distance ? formatDistance(selectedClinic.distance) : selectedClinic.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{selectedClinic.patientsInQueue} in queue</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectClinic(selectedClinic)}
                    className="flex-1 h-12 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 transition-colors active:scale-[0.98]"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onCheckIn(selectedClinic)}
                    disabled={!selectedClinic.isOpen}
                    className={cn(
                      'flex-1 h-12 flex items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-[0.98]',
                      selectedClinic.isOpen
                        ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    )}
                  >
                    Check In
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
