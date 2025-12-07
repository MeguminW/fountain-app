'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  MapPin,
  User,
  Shield,
  CreditCard,
  Stethoscope,
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clinic, UserProfile, InsuranceType } from '@/types/clinic'
import { cn, getEstimatedArrivalTime } from '@/lib/utils'

interface CheckInFlowProps {
  clinic: Clinic
  profile: UserProfile | null
  onBack: () => void
  onComplete: (formData: CheckInFormData) => void
}

export interface CheckInFormData {
  fullName: string
  phone: string
  dateOfBirth: string
  insuranceType: InsuranceType
  healthCard: string
  email: string
  reasonForVisit: string
  symptoms: string
  medications: string
  allergies: string
  familyDoctor: string
  privacyConsent: boolean
}

type Step = 'confirm' | 'info' | 'medical' | 'review' | 'success'

// Format Ontario health card number
const formatHealthCard = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 4) {
    return digits
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  } else {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 10)}`
  }
}

export function CheckInFlow({ clinic, profile, onBack, onComplete }: CheckInFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('confirm')
  const [formData, setFormData] = useState<CheckInFormData>({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    dateOfBirth: profile?.dateOfBirth || '',
    insuranceType: profile?.insuranceType || 'ontario-health-card',
    healthCard: profile?.healthCard || '',
    email: profile?.email || '',
    reasonForVisit: '',
    symptoms: '',
    medications: profile?.medications || '',
    allergies: profile?.allergies || '',
    familyDoctor: profile?.familyDoctor || '',
    privacyConsent: false,
  })

  const updateField = (field: keyof CheckInFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleHealthCardChange = (value: string) => {
    if (formData.insuranceType === 'ontario-health-card') {
      updateField('healthCard', formatHealthCard(value))
    } else {
      updateField('healthCard', value)
    }
  }

  const handleConfirm = () => setCurrentStep('info')
  const handleInfoNext = () => setCurrentStep('medical')
  const handleMedicalNext = () => setCurrentStep('review')

  const handleSubmit = () => {
    setCurrentStep('success')
    onComplete(formData)
  }

  const stepIndex = {
    confirm: 0,
    info: 1,
    medical: 2,
    review: 3,
    success: 4,
  }

  // If insurance type is 'none', health card is not required
  const canProceedInfo = formData.insuranceType === 'none'
    ? formData.fullName && formData.phone && formData.dateOfBirth
    : formData.fullName && formData.phone && formData.dateOfBirth && formData.healthCard
  const canProceedMedical = formData.reasonForVisit
  const canSubmit = formData.privacyConsent

  return (
    <motion.div
      className="fixed inset-0 z-[1100] bg-neutral-50 flex flex-col max-w-[430px] mx-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (currentStep === 'confirm') onBack()
              else if (currentStep === 'info') setCurrentStep('confirm')
              else if (currentStep === 'medical') setCurrentStep('info')
              else if (currentStep === 'review') setCurrentStep('medical')
            }}
            disabled={currentStep === 'success'}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-100 transition-colors active:scale-95 disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-base font-semibold text-neutral-900 flex-1">
            {currentStep === 'confirm' && 'Confirm Check-In'}
            {currentStep === 'info' && 'Personal Information'}
            {currentStep === 'medical' && 'Visit Information'}
            {currentStep === 'review' && 'Review & Confirm'}
            {currentStep === 'success' && "You're Checked In!"}
          </h1>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'success' && (
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Step {stepIndex[currentStep] + 1} of 4
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-neutral-900 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((stepIndex[currentStep] + 1) / 4) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-32">
        <AnimatePresence mode="wait">
          {/* STEP: Confirm */}
          {currentStep === 'confirm' && (
            <motion.div
              key="confirm"
              className="px-5 py-5 space-y-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Clinic Card */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold',
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
                <h3 className="text-xl font-bold text-neutral-900 mb-5 tracking-tight">
                  {clinic.name}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                        Estimated Wait
                      </p>
                      <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                        ~{clinic.waitTime}<span className="text-lg text-neutral-400 font-medium ml-1">min</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                        Patients in Queue
                      </p>
                      <p className="text-2xl font-bold text-neutral-900 tabular-nums">
                        {clinic.patientsInQueue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                        Suggested Arrival
                      </p>
                      <p className="text-2xl font-bold text-neutral-900">
                        By {getEstimatedArrivalTime(Math.max(0, clinic.waitTime - 10))}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Info Notice */}
              <motion.div
                className="bg-blue-50 rounded-2xl p-4 border border-blue-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-900 font-medium leading-relaxed">
                    After joining, you'll receive updates on your queue position. Head to the clinic before it's your turn.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP: Personal Information */}
          {currentStep === 'info' && (
            <motion.div
              key="info"
              className="px-5 py-5 space-y-5"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-1 tracking-tight">
                  Personal Information
                </h2>
                <p className="text-sm text-neutral-500">
                  Please provide your details for our records
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(519) 123-4567"
                    className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all tabular-nums"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Insurance Type */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Insurance Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.insuranceType}
                    onValueChange={(value: InsuranceType) => {
                      updateField('insuranceType', value)
                      if (value === 'none') {
                        updateField('healthCard', '')
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ontario-health-card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-neutral-500" />
                          Ontario Health Card
                        </div>
                      </SelectItem>
                      <SelectItem value="private-insurance">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-neutral-500" />
                          Private Insurance
                        </div>
                      </SelectItem>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-neutral-500" />
                          None / Self-Pay
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Health Card / Insurance Number */}
                {formData.insuranceType !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                      {formData.insuranceType === 'ontario-health-card' ? 'Health Card Number' : 'Insurance Number'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.healthCard}
                      onChange={(e) => handleHealthCardChange(e.target.value)}
                      placeholder={formData.insuranceType === 'ontario-health-card' ? '1234-567-890' : 'Enter insurance number'}
                      maxLength={formData.insuranceType === 'ontario-health-card' ? 12 : undefined}
                      className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all tabular-nums"
                    />
                    {formData.insuranceType === 'ontario-health-card' && (
                      <p className="text-xs text-neutral-400 mt-1.5 ml-1">Format: XXXX-XXX-XXX</p>
                    )}
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Email <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: Medical Information */}
          {currentStep === 'medical' && (
            <motion.div
              key="medical"
              className="px-5 py-5 space-y-5"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-1 tracking-tight">
                  Visit Information
                </h2>
                <p className="text-sm text-neutral-500">
                  Help us understand your visit better
                </p>
              </div>

              <div className="space-y-4">
                {/* Reason for Visit */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Reason for Visit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reasonForVisit}
                    onChange={(e) => updateField('reasonForVisit', e.target.value)}
                    placeholder="e.g., Cold, Flu, Injury, Check-up"
                    className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Symptoms */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Symptoms <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => updateField('symptoms', e.target.value)}
                    placeholder="Describe your symptoms..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Medications */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Current Medications <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => updateField('medications', e.target.value)}
                    placeholder="List any medications you're currently taking..."
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Allergies */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Allergies <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => updateField('allergies', e.target.value)}
                    placeholder="e.g., Penicillin, Peanuts"
                    className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Family Doctor */}
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                    Family Doctor <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.familyDoctor}
                    onChange={(e) => updateField('familyDoctor', e.target.value)}
                    placeholder="Dr. Smith"
                    className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-2xl text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: Review */}
          {currentStep === 'review' && (
            <motion.div
              key="review"
              className="px-5 py-5 space-y-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-1 tracking-tight">
                  Review & Confirm
                </h2>
                <p className="text-sm text-neutral-500">
                  Please review your information before submitting
                </p>
              </div>

              {/* Summary Cards */}
              <motion.div
                className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-neutral-600" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                      Personal Information
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentStep('info')}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Name</span>
                    <span className="font-medium text-neutral-900">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Phone</span>
                    <span className="font-medium text-neutral-900">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">DOB</span>
                    <span className="font-medium text-neutral-900">{formData.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Insurance</span>
                    <span className="font-medium text-neutral-900">
                      {formData.insuranceType === 'ontario-health-card' && 'Ontario Health Card'}
                      {formData.insuranceType === 'private-insurance' && 'Private Insurance'}
                      {formData.insuranceType === 'none' && 'None'}
                    </span>
                  </div>
                  {formData.healthCard && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">
                        {formData.insuranceType === 'ontario-health-card' ? 'Health Card' : 'Insurance #'}
                      </span>
                      <span className="font-medium text-neutral-900 tabular-nums">{formData.healthCard}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-neutral-600" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                      Visit Information
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentStep('medical')}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Reason</span>
                    <span className="font-medium text-neutral-900">{formData.reasonForVisit}</span>
                  </div>
                  {formData.symptoms && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Symptoms</span>
                      <span className="font-medium text-neutral-900 text-right max-w-[60%]">{formData.symptoms}</span>
                    </div>
                  )}
                  {formData.allergies && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Allergies</span>
                      <span className="font-medium text-neutral-900">{formData.allergies}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Privacy Consent */}
              <motion.div
                className="bg-neutral-100 rounded-2xl p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => updateField('privacyConsent', !formData.privacyConsent)}
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                      formData.privacyConsent
                        ? 'bg-neutral-900'
                        : 'bg-white border-2 border-neutral-300'
                    )}
                  >
                    {formData.privacyConsent && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <label
                    onClick={() => updateField('privacyConsent', !formData.privacyConsent)}
                    className="text-sm text-neutral-700 leading-relaxed cursor-pointer"
                  >
                    I consent to the collection and use of my personal health information for the purpose of receiving medical care at this clinic. <span className="text-red-500">*</span>
                  </label>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP: Success */}
          {currentStep === 'success' && (
            <motion.div
              key="success"
              className="px-5 py-12 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                You're Checked In!
              </motion.h2>
              <motion.p
                className="text-neutral-500 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                Your position in the queue has been confirmed.
              </motion.p>

              <motion.div
                className="bg-white rounded-3xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Your Queue Number
                </p>
                <p className="text-7xl font-bold text-neutral-900 tabular-nums tracking-tighter">
                  #{clinic.patientsInQueue + 1}
                </p>
                <p className="text-sm text-neutral-500 mt-3">
                  Estimated wait: ~{clinic.waitTime} min
                </p>
              </motion.div>

              <motion.p
                className="text-sm text-neutral-500 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                We'll notify you when it's almost your turn. Head to the clinic before your estimated time.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Actions */}
      {currentStep !== 'success' && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/80 backdrop-blur-xl border-t border-neutral-100 p-5 safe-bottom"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 40 }}
        >
          {currentStep === 'confirm' && (
            <button
              onClick={handleConfirm}
              className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-semibold text-[15px] hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Continue to Check-In
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 'info' && (
            <button
              disabled={!canProceedInfo}
              onClick={handleInfoNext}
              className={cn(
                'w-full h-14 rounded-2xl font-semibold text-[15px] transition-all flex items-center justify-center gap-2',
                canProceedInfo
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              )}
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 'medical' && (
            <button
              disabled={!canProceedMedical}
              onClick={handleMedicalNext}
              className={cn(
                'w-full h-14 rounded-2xl font-semibold text-[15px] transition-all flex items-center justify-center gap-2',
                canProceedMedical
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              )}
            >
              Review Information
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 'review' && (
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className={cn(
                'w-full h-14 rounded-2xl font-semibold text-[15px] transition-all flex items-center justify-center gap-2',
                canSubmit
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              )}
            >
              <Check className="w-4 h-4" />
              Confirm Check-In
            </button>
          )}
        </motion.div>
      )}

      {/* Success Actions */}
      {currentStep === 'success' && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/80 backdrop-blur-xl border-t border-neutral-100 p-5 safe-bottom"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 40 }}
        >
          <button
            onClick={onBack}
            className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-semibold text-[15px] hover:bg-neutral-800 active:scale-[0.98] transition-all"
          >
            View My Queue
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
