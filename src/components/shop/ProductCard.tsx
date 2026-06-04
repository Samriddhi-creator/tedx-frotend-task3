'use client'
import { useState } from 'react'
import { Product } from '@/types/shop'
import { useCart } from '@/store/cartStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Props = {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const { items, addItem, updateQuantity } = useCart()
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants?.[0] ?? undefined
    )
    const [showDetails, setShowDetails] = useState(false)

    const cartItem = items.find(
        item =>
            item.product.id === product.id &&
            item.selectedVariant?.value === selectedVariant?.value
    )
    const quantity = cartItem?.quantity ?? 0

    const handleAdd = () => addItem(product, selectedVariant)
    const handleDecrement = () => updateQuantity(product.id, quantity - 1)

    return (
        <>
            <div className={`flex gap-4 py-5 border-b border-[#e0ddd8] transition-colors ${quantity > 0 ? 'bg-[#e8e4dc]' : ''
                }`}>

                {/* Image */}
                <div className="w-20 h-20 bg-[#e0ddd8] rounded shrink-0 overflow-hidden">
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={e => (e.currentTarget.style.display = 'none')}
                        />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-[#1a1a1a] text-sm">{product.name}</h3>
                        <span className="text-[#1a1a1a] text-sm shrink-0 ml-4">
                            ₹{product.price}.00
                        </span>
                    </div>
                    <p className="text-[#888] text-xs mb-3">{product.description}</p>

                    {/* Variant selector */}
                    {product.variants && (
                        <select
                            value={selectedVariant?.value}
                            onChange={e => {
                                const v = product.variants!.find(v => v.value === e.target.value)
                                setSelectedVariant(v)
                            }}
                            className="bg-white border border-[#ccc] text-[#555] text-xs rounded px-2 py-1 mb-3"
                        >
                            {product.variants.map(v => (
                                <option key={v.value} value={v.value}>{v.label}</option>
                            ))}
                        </select>
                    )}

                    {/* Bottom row */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowDetails(true)}
                            className="text-xs tracking-widest text-[#aaa] hover:text-[#555] transition-colors"
                        >
                            ⊕ DETAILS
                        </button>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 ml-auto">
                            {quantity > 0 && (
                                <button
                                    onClick={handleDecrement}
                                    className="w-6 h-6 border border-[#ccc] rounded text-[#555] hover:border-[#888] transition-colors text-sm"
                                >
                                    −
                                </button>
                            )}
                            {quantity > 0 && (
                                <span className="text-sm w-4 text-center text-[#1a1a1a]">{quantity}</span>
                            )}
                            <button
                                onClick={handleAdd}
                                className="w-6 h-6 border border-[#ccc] rounded text-[#555] hover:border-[#888] transition-colors text-sm"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="bg-white border-[#e0ddd8] text-[#1a1a1a]">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-[#1a1a1a]">{product.name}</DialogTitle>
                    </DialogHeader>
                    <p className="text-[#888] text-sm">{product.description}</p>
                    {product.specifications && (
                        <div className="mt-4">
                            <p className="text-xs tracking-widest text-[#aaa] mb-3">SPECIFICATIONS</p>
                            <ul className="space-y-2">
                                {product.specifications.map((spec, i) => (
                                    <li key={i} className="text-sm text-[#555] flex gap-2">
                                        <span className="text-[#888]">—</span>
                                        {spec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}