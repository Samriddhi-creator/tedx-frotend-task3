'use client'

import { UserDetails, DeliveryDetails } from '@/types/shop'
import { useCart } from '@/store/cartStore'

type Props = {
    userDetails: UserDetails
    deliveryDetails: DeliveryDetails
    onEdit: (step: number) => void
}

export default function StepReview({ userDetails, deliveryDetails, onEdit }: Props) {
    const { items, appliedPromo, getSubtotal, getDiscount, getTotal } = useCart()

    return (
        <div>
            <h2 className="font-serif text-2xl mb-1 text-[#1a1a1a]">Order Manifest</h2>
            <p className="text-[#888] text-sm mb-8">Review your expedition details before transmission.</p>

            {/* Personal details */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-xs tracking-widest text-[#aaa]">EXPLORER</p>
                    <button
                        onClick={() => onEdit(1)}
                        className="text-xs text-[#888] hover:text-[#1a1a1a] transition-colors"
                    >
                        EDIT
                    </button>
                </div>
                <div className="space-y-1 text-sm text-[#1a1a1a]">
                    <p>{userDetails.fullName}</p>
                    <p className="text-[#888]">{userDetails.email}</p>
                    <p className="text-[#888]">{userDetails.phone}</p>
                </div>
            </div>

            <div className="border-t border-[#e0ddd8] my-4" />

            {/* Delivery details */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-xs tracking-widest text-[#aaa]">COLLECTION ROUTE</p>
                    <button
                        onClick={() => onEdit(2)}
                        className="text-xs text-[#888] hover:text-[#1a1a1a] transition-colors"
                    >
                        EDIT
                    </button>
                </div>
                <div className="space-y-1 text-sm text-[#1a1a1a]">
                    {deliveryDetails.type === 'in-campus' ? (
                        <>
                            <p>In Campus</p>
                            <p className="text-[#888]">{deliveryDetails.hostel}</p>
                            {deliveryDetails.roomNumber && (
                                <p className="text-[#888]">Room {deliveryDetails.roomNumber}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p>Out of Campus</p>
                            <p className="text-[#888]">{deliveryDetails.addressLine}</p>
                            <p className="text-[#888]">
                                {deliveryDetails.city}, {deliveryDetails.state} — {deliveryDetails.postalCode}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="border-t border-[#e0ddd8] my-4" />

            {/* Items */}
            <div className="mb-6">
                <p className="text-xs tracking-widest text-[#aaa] mb-3">PAYLOAD</p>
                <div className="space-y-3">
                    {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <div>
                                <p className="text-[#1a1a1a]">{item.product.name}</p>
                                <p className="text-[#aaa] text-xs">
                                    {item.selectedVariant ? `${item.selectedVariant.label} · ` : ''}
                                    qty {item.quantity}
                                </p>
                            </div>
                            <span className="text-[#1a1a1a]">₹{item.product.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-[#e0ddd8] my-4" />

            {/* Pricing */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#888]">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal()}</span>
                </div>
                {getDiscount() > 0 && (
                    <>
                        <div className="flex justify-between text-sm text-[#888]">
                            <span>Discount ({appliedPromo?.code})</span>
                            <span className="text-green-600">−₹{getDiscount()}</span>
                        </div>
                    </>
                )}
                <div className="flex justify-between text-sm font-medium text-[#1a1a1a]">
                    <span>Total</span>
                    <span>₹{getTotal()}</span>
                </div>
            </div>
        </div>
    )
}