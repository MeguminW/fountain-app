import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ClinicHours } from '@/types/clinic'

/**
 * Merge Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format phone number: (519) 555-0123
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/**
 * Mask phone number: (519) ***-0123
 */
export function maskPhone(phone: string): string {
  const formatted = formatPhone(phone)
  return formatted.replace(/\d{3}-/, '***-')
}

/**
 * Get wait time color based on minutes
 */
export function getWaitTimeColor(minutes: number): string {
  if (minutes < 15) return 'text-emerald-600'
  if (minutes < 30) return 'text-amber-600'
  if (minutes < 60) return 'text-orange-600'
  return 'text-red-600'
}

/**
 * Get wait time background color based on minutes
 */
export function getWaitTimeBgColor(minutes: number): string {
  if (minutes < 15) return 'bg-emerald-50'
  if (minutes < 30) return 'bg-amber-50'
  if (minutes < 60) return 'bg-orange-50'
  return 'bg-red-50'
}

/**
 * Get wait time label
 */
export function getWaitTimeLabel(minutes: number): string {
  if (minutes < 15) return 'Short Wait'
  if (minutes < 30) return 'Moderate'
  if (minutes < 60) return 'Busy'
  return 'Very Busy'
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

/**
 * Check if clinic is currently open
 */
export function isClinicOpen(hours: ClinicHours): boolean {
  const now = new Date()
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  const today = days[now.getDay()]
  const todayHours = hours[today]

  if (!todayHours || todayHours.toLowerCase() === 'closed') {
    return false
  }

  // Parse hours like "9:00-17:00"
  const match = todayHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!match) return false

  const [, openHour, openMin, closeHour, closeMin] = match
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = parseInt(openHour) * 60 + parseInt(openMin)
  const closeMinutes = parseInt(closeHour) * 60 + parseInt(closeMin)

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

/**
 * Get today's hours string
 */
export function getTodayHours(hours: ClinicHours): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  const today = days[new Date().getDay()]
  return hours[today] || 'Closed'
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate estimated arrival time
 */
export function getEstimatedArrivalTime(waitMinutes: number): string {
  const arrivalTime = new Date(Date.now() + waitMinutes * 60 * 1000)
  return arrivalTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
