'use client'
import { useState } from 'react'
import { Product } from '@/types/shop'
import { useCart } from '@/store/cartStore'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

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
            <div className={`pb-8 border-b border-stone-300/60 mb-0 transition-colors ${quantity > 0 ? 'bg-stone-50' : ''}`}>
                <div className="h-48 flex gap-8">

                    {/* Image */}
                    <div className="w-48 h-48 bg-stone-100 shrink-0 overflow-hidden relative">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={e => (e.currentTarget.style.display = 'none')}
                            />
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/90 border border-stone-200 px-2 py-0.5">
                            <span className="text-[9px] text-stone-500 uppercase tracking-wide font-['Consolas']">
                                REF: {product.id.slice(0, 4).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="max-w-96">
                                    <h3 className="text-xl font-medium text-neutral-900 leading-7">{product.name}</h3>
                                    <p className="text-stone-500 text-sm leading-6 mt-2">{product.description}</p>
                                </div>
                                <span className="text-lg font-medium text-neutral-900 shrink-0 ml-4">
                                    ₹{product.price}.00
                                </span>
                            </div>
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center">

                            {/* Variant selector */}
                            {product.variants && (
                                <select
                                    value={selectedVariant?.value}
                                    onChange={e => {
                                        const v = product.variants!.find(v => v.value === e.target.value)
                                        setSelectedVariant(v)
                                    }}
                                    className="border border-stone-300 text-stone-500 text-xs px-2 py-2 mr-4 w-16 bg-white"
                                >
                                    {product.variants.map(v => (
                                        <option key={v.value} value={v.value}>{v.value}</option>
                                    ))}
                                </select>
                            )}

                            {/* Details button */}
                            <button
                                onClick={() => setShowDetails(true)}
                                className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors font-['Consolas']"
                            >
                                <span className="text-sm">⊕</span> Details
                            </button>

                            {/* Quantity controls */}
                            <div className="ml-auto flex items-center border border-stone-300/80 bg-white shadow-sm">
                                <button
                                    onClick={handleDecrement}
                                    disabled={quantity === 0}
                                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 disabled:opacity-30 transition-colors"
                                >
                                    <span className="text-xs">−</span>
                                </button>
                                <div className="w-10 h-8 bg-stone-50/50 flex items-center justify-center">
                                    <span className="text-sm text-neutral-900 font-['Consolas']">{quantity}</span>
                                </div>
                                <button
                                    onClick={handleAdd}
                                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    <span className="text-xs">+</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="bg-stone-100 border-stone-300 text-neutral-900 p-0 max-w-[672px] overflow-hidden">
                    <VisuallyHidden.Root>
                        <DialogTitle>{product.name}</DialogTitle>
                    </VisuallyHidden.Root>
                    <div className="flex">
                        {/* Left — Image */}
                        <div className="w-64 shrink-0 bg-stone-200 relative">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-96 bg-stone-200" />
                            )}
                            <div className="absolute bottom-4 left-4 bg-white/90 border border-stone-200 px-2 py-0.5">
                                <span className="text-[9px] text-stone-500 uppercase tracking-wide font-['Consolas']">
                                    REF: {product.id.slice(0, 2).toUpperCase()}1
                                </span>
                            </div>
                            <div className="absolute top-1.5 left-1.5 w-2 h-2 border-l border-t border-stone-400" />
                            <div className="absolute top-1.5 right-1.5 w-2 h-2 border-r border-t border-stone-400" />
                            <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-l border-b border-stone-400" />
                            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-r border-b border-stone-400" />
                        </div>

                        {/* Right — Content */}
                        <div className="flex-1 p-10 flex flex-col">
                            <div className="pb-4 border-b border-stone-200 mb-4">
                                <p className="text-[10px] text-stone-400 uppercase tracking-wide font-['Consolas']">
                                    Archive Reference: {product.id}
                                </p>
                            </div>
                            <h2 className="text-2xl font-medium text-neutral-900 mb-4">{product.name}</h2>
                            <p className="text-stone-600 text-base leading-6 mb-8">{product.description}</p>

                            {product.specifications && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <p className="text-xs text-stone-900 uppercase tracking-wider font-['Consolas']">Specifications</p>
                                    </div>
                                    <div className="pl-4 border-l border-stone-200">
                                        <p className="text-stone-500 text-sm leading-6">
                                            {product.specifications.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}