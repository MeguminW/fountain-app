export interface ClinicHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  city: string
  phone: string
  website?: string
  hours: ClinicHours
  latitude: number
  longitude: number
  distance?: number // km from user
  waitTime: number // minutes
  patientsInQueue: number
  isOpen: boolean
  isPriority?: boolean // For Bundle Medical (show first)
}

export interface QueueEntry {
  id: string
  clinicId: string
  clinicName: string
  queueNumber: number
  position: number
  estimatedWait: number
  patientsAhead: number
  status: 'waiting' | 'almost' | 'ready'
  joinedAt: string
  intakeCompleted: boolean
  reasonForVisit?: string
}

export type InsuranceType = 'ontario-health-card' | 'private-insurance' | 'none'

export interface UserProfile {
  id: string
  fullName: string
  dateOfBirth: string
  phone: string
  email?: string
  insuranceType?: InsuranceType
  healthCard?: string
  allergies?: string
  medications?: string
  familyDoctor?: string
  preferredPharmacy?: string
  notificationsEnabled: boolean
  language: 'en' | 'fr'
}
