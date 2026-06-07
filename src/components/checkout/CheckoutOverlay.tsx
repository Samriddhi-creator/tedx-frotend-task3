'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { UserDetails, DeliveryDetails } from '@/types/shop'
import StepPersonal from './StepPersonal'
import StepDelivery from './StepDelivery'
import StepReview from './StepReview'
import SuccessScreen from './SuccessScreen'

type Props = {
    isOpen: boolean
    onClose: () => void
}

const steps = [
    { id: 1, label: ' Coordinates' },
    { id: 2, label: 'Route' },
    { id: 3, label: 'Manifest' }
]

export default function CheckoutOverlay({ isOpen, onClose }: Props) {
    const [currentStep, setCurrentStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [userDetails, setUserDetails] = useState<UserDetails>({
        fullName: '', email: '', phone: ''
    })
    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
        type: 'in-campus'
    })

    const goNext = () => {
        setDirection(1)
        setCurrentStep(s => s + 1)
    }

    const goBack = () => {
        setDirection(-1)
        setCurrentStep(s => s - 1)
    }

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
    }
    const [isSuccess, setIsSuccess] = useState(false)

    const isStepValid = () => {
        if (currentStep === 1) {
            return (
                userDetails.fullName.trim() !== '' &&
                userDetails.email.trim() !== '' &&
                userDetails.phone.trim() !== ''
            )
        }
        if (currentStep === 2) {
            if (deliveryDetails.type === 'in-campus') {
                return (
                    (deliveryDetails.hostel ?? '').trim() !== '' &&
                    (deliveryDetails.roomNumber ?? '').trim() !== ''
                )
            } else {
                return (
                    (deliveryDetails.addressLine ?? '').trim() !== '' &&
                    (deliveryDetails.city ?? '').trim() !== '' &&
                    (deliveryDetails.state ?? '').trim() !== '' &&
                    (deliveryDetails.postalCode ?? '').trim() !== ''
                )
            }
        }
        return true
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isSuccess ? onClose : undefined}
                        className="fixed inset-0 bg-black/40 z-40"
                    />

                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6"
                    >
                        <div className="bg-white rounded w-full max-w-3xl shadow-xl overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-[#e0ddd8]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-[#1a1a1a] flex items-center justify-center">
                                        <span className="text-xs">⊕</span>
                                    </div>
                                    <div>
                                        <p className="text-xs tracking-widest text-[#aaa]">
                                            {isSuccess ? 'TRANSMISSION STATUS' : 'CHECKOUT PROTOCOL'}
                                        </p>
                                        <p className="font-serif text-lg text-[#1a1a1a]">
                                            {isSuccess ? 'Expedition Confirmed' : (
                                                <>
                                                    {currentStep === 1 && 'Identify Explorer'}
                                                    {currentStep === 2 && 'Delivery Route'}
                                                    {currentStep === 3 && 'Order Manifest'}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {!isSuccess && (
                                    <button
                                        onClick={onClose}
                                        className="flex items-center gap-1 text-xs tracking-widest text-[#aaa] hover:text-[#1a1a1a] transition-colors"
                                    >
                                        <X size={14} />
                                        ABORT
                                    </button>
                                )}
                            </div>

                            {isSuccess ? (
                                <SuccessScreen
                                    email={userDetails.email}
                                    onClose={() => {
                                        setIsSuccess(false)
                                        setCurrentStep(1)
                                        onClose()
                                    }}
                                />
                            ) : (
                                <>
                                    {/* ── Body ── */}
                                    <div className="flex flex-col sm:flex-row" style={{ minHeight: '380px' }}>
                                        {/* ── Step Progress Sidebar ── */}
                                        <div className="sm:w-48 border-b sm:border-b-0 sm:border-r border-[#e0ddd8] px-4 sm:px-6 py-4 sm:py-8 flex sm:flex-col justify-between shrink-0">
                                            <div className="flex sm:flex-col gap-4 sm:gap-0">
                                                <p className="hidden sm:block text-xs tracking-widest text-[#aaa] mb-6">PROGRESS</p>
                                                <div className="flex sm:flex-col gap-4 sm:gap-6">
                                                    {steps.map(step => (
                                                        <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center text-xs shrink-0 ${currentStep > step.id
                                                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                                                : currentStep === step.id
                                                                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                                                                    : 'border-[#ccc] text-[#ccc]'
                                                                }`}>
                                                                {currentStep > step.id ? '✓' : step.id}
                                                            </div>
                                                            <span className={`text-xs sm:text-sm ${currentStep === step.id
                                                                ? 'text-[#1a1a1a] font-medium'
                                                                : currentStep > step.id
                                                                    ? 'text-[#1a1a1a]'
                                                                    : 'text-[#ccc]'
                                                                }`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="hidden sm:block border border-[#e0ddd8] rounded p-3 text-xs text-[#aaa] leading-relaxed">
                                                Encryption active.<br />
                                                Transmission secure.<br />
                                                Terra Incognita Server.
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-hidden relative">
                                            <AnimatePresence custom={direction} mode="wait">
                                                <motion.div
                                                    key={currentStep}
                                                    custom={direction}
                                                    variants={variants}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute inset-0 px-4 sm:px-8 py-5 sm:py-8 overflow-y-auto"
                                                >
                                                    {currentStep === 1 && (
                                                        <StepPersonal details={userDetails} onChange={setUserDetails} />
                                                    )}
                                                    {currentStep === 2 && (
                                                        <StepDelivery details={deliveryDetails} onChange={setDeliveryDetails} />
                                                    )}
                                                    {currentStep === 3 && (
                                                        <StepReview
                                                            userDetails={userDetails}
                                                            deliveryDetails={deliveryDetails}
                                                            onEdit={(step) => {
                                                                setDirection(-1)
                                                                setCurrentStep(step)
                                                            }}
                                                        />
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* ── Footer ── */}
                                    <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 border-t border-[#e0ddd8]">
                                        {currentStep > 1 ? (
                                            <button
                                                onClick={goBack}
                                                className="text-xs tracking-widest text-[#888] hover:text-[#1a1a1a] transition-colors"
                                            >
                                                ← BACK
                                            </button>
                                        ) : (
                                            <div />
                                        )}

                                        <button
                                            onClick={currentStep < 3 ? goNext : () => setIsSuccess(true)}
                                            disabled={!isStepValid()}
                                            className="px-6 py-3 text-xs tracking-widest rounded transition-colors
                                                       bg-[#1a1a1a] text-white hover:bg-[#333] 
                                                       disabled:bg-[#e0ddd8] disabled:text-[#aaa] disabled:cursor-not-allowed"
                                        >
                                            {currentStep === 3 ? 'PROCEED TO PAYMENT' : 'CONTINUE →'}
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}