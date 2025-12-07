'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav, TabType } from '@/components/app/BottomNav'
import { HomeTab } from '@/components/app/HomeTab'
import { MapTab } from '@/components/app/MapTab'
import { QueueTab } from '@/components/app/QueueTab'
import { ProfileTab } from '@/components/app/ProfileTab'
import { ClinicDetail } from '@/components/app/ClinicDetail'
import { CheckInFlow } from '@/components/app/CheckInFlow'
import { Clinic, QueueEntry, UserProfile } from '@/types/clinic'
import { CLINICS } from '@/data/clinics'

// Demo user location (Kitchener city center)
const USER_LOCATION = {
  lat: 43.4516,
  lng: -80.4925,
}

// Demo user profile
const DEMO_PROFILE: UserProfile = {
  id: 'demo-user-001',
  fullName: 'Sarah Mitchell',
  dateOfBirth: '1990-05-15',
  phone: '(519) 555-0123',
  email: 'sarah.mitchell@email.com',
  healthCard: '1234-567-890-AB',
  allergies: 'Penicillin, Peanuts',
  medications: 'Lisinopril 10mg daily',
  preferredPharmacy: 'Shoppers Drug Mart - King St',
  notificationsEnabled: true,
  language: 'en',
}

// Demo queue entry - shows #5 with ~35 min and 4 patients ahead
const DEMO_QUEUE_ENTRY: QueueEntry = {
  id: 'demo-queue-001',
  clinicId: 'bundle-medical',
  clinicName: 'Bundle Medical & Sportsworld Walk-In Clinic',
  queueNumber: 5,
  position: 5,
  estimatedWait: 35,
  patientsAhead: 4,
  status: 'waiting',
  joinedAt: new Date().toISOString(),
  intakeCompleted: true,
}

export default function PatientApp() {
  const [activeTab, setActiveTab] = useState<TabType>('queue')
  const [clinics, setClinics] = useState<Clinic[]>(CLINICS)
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [showClinicDetail, setShowClinicDetail] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [queueEntry, setQueueEntry] = useState<QueueEntry | null>(DEMO_QUEUE_ENTRY)
  const [queueClinic, setQueueClinic] = useState<Clinic | null>(CLINICS.find(c => c.id === 'bundle-medical') || null)
  const [profile, setProfile] = useState<UserProfile>(DEMO_PROFILE)

  // Simulate real-time wait time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setClinics((prev) =>
        prev.map((clinic) => ({
          ...clinic,
          waitTime: Math.max(
            5,
            clinic.waitTime + Math.floor(Math.random() * 7) - 3
          ),
          patientsInQueue: Math.max(
            1,
            clinic.patientsInQueue + Math.floor(Math.random() * 3) - 1
          ),
        }))
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Simulate queue position updates when in queue
  useEffect(() => {
    if (!queueEntry) return

    const interval = setInterval(() => {
      setQueueEntry((prev) => {
        if (!prev) return null

        const newPatientsAhead = Math.max(0, prev.patientsAhead - 1)
        const newEstimatedWait = Math.max(0, prev.estimatedWait - 5)
        const newStatus =
          newPatientsAhead <= 2
            ? 'almost'
            : newPatientsAhead === 0
            ? 'ready'
            : 'waiting'

        return {
          ...prev,
          patientsAhead: newPatientsAhead,
          estimatedWait: newEstimatedWait,
          status: newStatus,
        }
      })
    }, 60000) // Update every minute for demo

    return () => clearInterval(interval)
  }, [queueEntry])

  // Track if user just checked in (to auto-switch to queue tab only once)
  const [justCheckedIn, setJustCheckedIn] = useState(false)

  // Navigate to queue tab only after user just checked in
  useEffect(() => {
    if (justCheckedIn && queueEntry) {
      const timer = setTimeout(() => {
        setActiveTab('queue')
        setJustCheckedIn(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [justCheckedIn, queueEntry])

  // Handle clinic selection
  const handleSelectClinic = useCallback((clinic: Clinic) => {
    setSelectedClinic(clinic)
    setShowClinicDetail(true)
  }, [])

  // Handle check-in start
  const handleCheckIn = useCallback((clinic: Clinic) => {
    setSelectedClinic(clinic)
    setShowCheckIn(true)
    setShowClinicDetail(false)
  }, [])

  // Handle check-in completion
  const handleCheckInComplete = useCallback(
    (formData: { reasonForVisit: string; privacyConsent: boolean }) => {
      if (!selectedClinic) return

      // Create queue entry
      const newQueueEntry: QueueEntry = {
        id: `queue-${Date.now()}`,
        clinicId: selectedClinic.id,
        clinicName: selectedClinic.name,
        queueNumber: Math.floor(Math.random() * 50) + 100,
        position: selectedClinic.patientsInQueue + 1,
        estimatedWait: selectedClinic.waitTime + 5,
        patientsAhead: selectedClinic.patientsInQueue,
        status: 'waiting',
        joinedAt: new Date().toISOString(),
        intakeCompleted: true,
        reasonForVisit: formData.reasonForVisit,
      }

      setQueueEntry(newQueueEntry)
      setQueueClinic(selectedClinic)
      setShowCheckIn(false)
      setSelectedClinic(null)
      setJustCheckedIn(true)
    },
    [selectedClinic]
  )

  // Handle leaving queue
  const handleLeaveQueue = useCallback(() => {
    setQueueEntry(null)
    setQueueClinic(null)
  }, [])

  // Handle filling intake form
  const handleFillIntake = useCallback(() => {
    if (!queueEntry) return
    setQueueEntry((prev) =>
      prev ? { ...prev, intakeCompleted: true } : null
    )
  }, [queueEntry])

  // Handle directions
  const handleDirections = useCallback((clinic: Clinic) => {
    const address = encodeURIComponent(clinic.address)
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`,
      '_blank'
    )
  }, [])

  // Handle call
  const handleCall = useCallback((clinic: Clinic) => {
    window.location.href = `tel:${clinic.phone.replace(/[^\d]/g, '')}`
  }, [])

  // Handle profile actions
  const handleEditProfile = useCallback(() => {
    // In production: Open profile edit modal
    console.log('Edit profile')
  }, [])

  const handleViewHistory = useCallback(() => {
    // In production: Navigate to history view
    console.log('View history')
  }, [])

  const handleToggleNotifications = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }))
  }, [])

  const handleChangeLanguage = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      language: prev.language === 'en' ? 'fr' : 'en',
    }))
  }, [])

  // Handle Find Clinics from empty queue state
  const handleFindClinics = useCallback(() => {
    setActiveTab('home')
  }, [])

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            clinics={clinics}
            userLocation={USER_LOCATION}
            onSelectClinic={handleSelectClinic}
            onCheckIn={handleCheckIn}
          />
        )
      case 'map':
        return (
          <MapTab
            clinics={clinics}
            userLocation={USER_LOCATION}
            onSelectClinic={handleSelectClinic}
            onCheckIn={handleCheckIn}
          />
        )
      case 'queue':
        return (
          <QueueTab
            queueEntry={queueEntry}
            clinic={queueClinic}
            onLeaveQueue={handleLeaveQueue}
            onFillIntake={handleFillIntake}
            onDirections={() => queueClinic && handleDirections(queueClinic)}
            onFindClinics={handleFindClinics}
          />
        )
      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            onEditProfile={handleEditProfile}
            onViewHistory={handleViewHistory}
            onToggleNotifications={handleToggleNotifications}
            onChangeLanguage={handleChangeLanguage}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      {/* Main Content Area */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasActiveQueue={!!queueEntry}
      />

      {/* Clinic Detail Overlay */}
      <AnimatePresence>
        {showClinicDetail && selectedClinic && (
          <ClinicDetail
            clinic={selectedClinic}
            onBack={() => {
              setShowClinicDetail(false)
              setSelectedClinic(null)
            }}
            onJoinQueue={() => handleCheckIn(selectedClinic)}
            onDirections={() => handleDirections(selectedClinic)}
            onCall={() => handleCall(selectedClinic)}
          />
        )}
      </AnimatePresence>

      {/* Check-In Flow Overlay */}
      <AnimatePresence>
        {showCheckIn && selectedClinic && (
          <CheckInFlow
            clinic={selectedClinic}
            profile={profile}
            onBack={() => {
              setShowCheckIn(false)
              setSelectedClinic(null)
            }}
            onComplete={handleCheckInComplete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
