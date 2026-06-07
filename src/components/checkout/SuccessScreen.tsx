'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/store/cartStore'


type Props = {
    email: string
    onClose: () => void
}

export default function SuccessScreen({ email, onClose }: Props) {
    const { clearCart } = useCart()

    const [authCode] = useState(() => 'TI-' + Math.floor(100000 + Math.random() * 900000))

    const handleReturn = () => {
        clearCart()
        onClose()
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 px-8 text-center">

            {/* Checkmark */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6"
            >
                <span className="text-green-500 text-2xl">✓</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="font-serif text-3xl mb-3 text-[#1a1a1a]">Transmission Successful</h2>
                <p className="text-[#888] text-sm mb-8 max-w-sm">
                    Your coordinates have been mapped and your payload is secured.
                    Welcome to Terra Incognita, Explorer. A confirmation directive has been sent to {email}.
                </p>

                {/* Auth code */}
                <div className="border border-[#e0ddd8] rounded px-8 py-4 mb-8 inline-block">
                    <p className="text-xs tracking-widest text-[#aaa] mb-1">AUTHORIZATION CODE</p>
                    <p className="font-mono text-lg tracking-widest text-[#1a1a1a]">{authCode}</p>
                </div>

                <div>
                    <button
                        onClick={handleReturn}
                        className="px-8 py-3 bg-[#1a1a1a] hover:bg-[#333] text-white text-xs tracking-widest rounded transition-colors"
                    >
                        RETURN TO OUTPOST
                    </button>
                </div>
            </motion.div>
        </div>
    )
}