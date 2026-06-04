'use client'

import { UserDetails } from '@/types/shop'
import { User, Mail, Phone } from 'lucide-react'

type Props = {
    details: UserDetails
    onChange: (details: UserDetails) => void
}

export default function StepPersonal({ details, onChange }: Props) {
    const update = (field: keyof UserDetails, value: string) => {
        onChange({ ...details, [field]: value })
    }

    return (
        <div>
            <h2 className="font-serif text-2xl mb-1 text-[#1a1a1a]">Transmission Details</h2>
            <p className="text-[#888] text-sm mb-8">Please identify yourself for the expedition log.</p>

            {/* Full Name */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <User size={12} className="text-[#aaa]" />
                    <label className="text-xs tracking-widest text-[#aaa]">EXPLORER DESIGNATION</label>
                </div>
                <input
                    value={details.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    placeholder="Full Name"
                    className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
                />
            </div>

            {/* Email */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Mail size={12} className="text-[#aaa]" />
                    <label className="text-xs tracking-widest text-[#aaa]">COMM LINK</label>
                </div>
                <input
                    value={details.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="Email Address"
                    type="email"
                    className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
                />
            </div>

            {/* Phone */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Phone size={12} className="text-[#aaa]" />
                    <label className="text-xs tracking-widest text-[#aaa]">PRIORITY FREQUENCY</label>
                </div>
                <input
                    value={details.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="Phone Number"
                    type="tel"
                    className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
                />
            </div>
        </div>
    )
}