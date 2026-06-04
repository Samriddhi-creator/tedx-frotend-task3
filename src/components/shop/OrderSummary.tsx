'use client'

import { useState } from 'react'
import { useCart } from '@/store/cartStore'
import { toast } from 'sonner'

export default function OrderSummary({ onCheckout }: { onCheckout: () => void }) {
    const { items, appliedPromo, applyPromo, removePromo, getSubtotal, getDiscount, getTotal } = useCart()
    const [promoInput, setPromoInput] = useState('')
    const [promoLoading, setPromoLoading] = useState(false)

    const hasItems = items.length > 0

    const handleApplyPromo = async () => {
        setPromoLoading(true)
        await new Promise(r => setTimeout(r, 800))
        const valid = applyPromo(promoInput)
        setPromoLoading(false)
        if (valid) {
            toast.success('Promo code applied!')
            setPromoInput('')
        }
        else {
            toast.error('Invalid promo code')
        }
    }
    return (
        <div className="sticky top-8 border border-[#e0ddd8] rounded bg-white p-6">
            <p className="text-xs tracking-widest text-[#aaa] mb-2">EXPEDITION MANIFEST</p>
            <h2 className="font-serif text-xl mb-6 text-[#1a1a1a]">Selected Coordinates</h2>

            {/* Empty state */}
            {!hasItems ? (
                <p className="text-[#aaa] text-sm mb-6">
                    Awaiting survey input. Select coordinates to begin.
                </p>
            ) : (
                <div className="space-y-3 mb-6">
                    {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <div>
                                <p className="text-[#1a1a1a]">{item.product.name}</p>
                                <p className="text-[#aaa] text-xs">
                                    {item.selectedVariant ? `${item.selectedVariant.label} · ` : ''}
                                    qty {item.quantity}
                                </p>
                            </div>
                            <span className="text-[#1a1a1a]">
                                ₹{item.product.price * item.quantity}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Promo code */}
            {hasItems && (
                <div className="mb-6">
                    {appliedPromo ? (
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-green-600">✓ {appliedPromo.code} applied</span>
                            <button
                                onClick={removePromo}
                                className="text-[#aaa] hover:text-[#555] transition-colors"
                            >
                                remove
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                value={promoInput}
                                onChange={e => setPromoInput(e.target.value.toUpperCase())}
                                placeholder="PROMO CODE"
                                className="flex-1 bg-[#f8f7f4] border border-[#e0ddd8] rounded px-3 py-2 text-xs tracking-widest text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#aaa]"
                            />
                            <button
                                onClick={handleApplyPromo}
                                disabled={!promoInput || promoLoading}
                                className="px-3 py-2 bg-[#f0ede6] border border-[#e0ddd8] rounded text-xs tracking-widest text-[#555] hover:border-[#aaa] disabled:opacity-50 transition-colors"
                            >
                                {promoLoading ? '...' : 'APPLY'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Price breakdown */}
            {hasItems && (
                <div className="border-t border-[#e0ddd8] pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-[#888]">
                        <span>Subtotal</span>
                        <span>₹{getSubtotal()}</span>
                    </div>
                    {getDiscount() > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>−₹{getDiscount()}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm font-medium text-[#1a1a1a]">
                        <span>Total</span>
                        <span>₹{getTotal()}</span>
                    </div>
                </div>
            )}

            {/* Continue Expedtion button*/}
            <button
                onClick={onCheckout}
                disabled={!hasItems}
                className="w-full py-3 bg-[#6b6b6b] hover:bg-[#555] disabled:bg-[#e0ddd8] disabled:text-[#aaa] text-white text-xs tracking-widest rounded transition-colors"
            >
                CONTINUE EXPEDITION →
            </button>

            {/* Footer links */}
            {hasItems && (
                <div className="flex justify-center gap-6 mt-4 text-xs text-[#aaa]">
                    <span className="cursor-pointer hover:text-[#555]">STORE TRANSMISSION</span>
                    <span className="cursor-pointer hover:text-[#555]">ANNOTATION</span>
                </div>
            )}
        </div>
    )
}
