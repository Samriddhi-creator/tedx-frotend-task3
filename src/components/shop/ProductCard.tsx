'use client'
import { useState } from 'react'
import { Product } from '@/types/shop'
import { useCart } from '@/store/cartStore'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

type Props = {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const { items, addItem, updateQuantity } = useCart()

    const displayVariants = product.variants && product.variants.length > 0
        ? product.variants
        : [
            { value: 'S', label: 'Small' },
            { value: 'M', label: 'Medium' },
            { value: 'L', label: 'Large' }
        ]

    const [selectedVariant, setSelectedVariant] = useState(
        displayVariants[0] ?? undefined
    )
    const [showDetails, setShowDetails] = useState(false)

    const cartItem = items.find(
        item =>
            item.product.id === product.id &&
            item.selectedVariant?.value === selectedVariant?.value
    )
    const quantity = cartItem?.quantity ?? 0

    const handleAdd = () => addItem(product, selectedVariant)
    const handleDecrement = () => updateQuantity(product.id, quantity - 1, selectedVariant?.value)

    return (
        <>
            <Card
                className={`rounded-none border-0 border-b border-stone-300/60 shadow-none pb-6 mb-6 transition-colors ${quantity > 0 ? 'bg-stone-50/60' : 'bg-transparent'
                    }`}
            >
                {/* Changes layout to a complete vertical column on mobile, switching to side-by-side at 'sm:' breakpoint */}
                <CardContent className="p-0 h-auto md:h-48 flex flex-col sm:flex-row gap-4 md:gap-8">

                    {/* Image Container - Full width block on mobile */}
                    <div className="w-full sm:w-40 md:w-48 h-48 sm:h-40 md:h-48 bg-stone-100 shrink-0 overflow-hidden relative">
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

                    {/* Info Column */}
                    <div className="flex-1 flex flex-col justify-between px-1 sm:px-0 gap-4 sm:gap-2">
                        <div>
                            {/* CHANGED: flex-col on mobile so Price stacks below Title, returns to flex-row on sm screens */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <div className="max-w-xl">
                                    <h3 className="text-base md:text-xl font-medium text-neutral-900 leading-snug">
                                        {product.name}
                                    </h3>
                                    <p className="text-stone-500 text-xs md:text-sm leading-relaxed mt-1">
                                        {product.description}
                                    </p>
                                </div>
                                {/* Added mt-1 on mobile for clear text separation */}
                                <span className="text-base md:text-lg font-medium text-neutral-900 shrink-0 mt-1 sm:pt-0.5 whitespace-nowrap">
                                    ₹{product.price}.00
                                </span>
                            </div>
                        </div>

                        {/* CHANGED: flex-col on mobile so Quantity blocks stack below dropdowns, scales to flex-row on sm screens */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 sm:mt-0">

                            <div className="flex items-center gap-4">
                                {/* Variant Selector Dropdown */}
                                <div>
                                    <select
                                        value={selectedVariant?.value}
                                        onChange={e => {
                                            const v = displayVariants.find(v => v.value === e.target.value)
                                            if (v) setSelectedVariant(v)
                                        }}
                                        className="border border-stone-300 text-stone-600 text-xs px-2.5 py-1.5 bg-white cursor-pointer hover:border-stone-400 focus:outline-none min-w-[64px] font-['Consolas']"
                                    >
                                        {displayVariants.map(v => (
                                            <option key={v.value} value={v.value}>
                                                {v.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Details button */}
                                <button
                                    onClick={() => setShowDetails(true)}
                                    className="flex items-center gap-1 text-xs uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors font-['Consolas']"
                                >
                                    <span className="text-sm">⊕</span> Details
                                </button>
                            </div>

                            {/* CHANGED: Adjusted self-alignment so it stretches or stays clean in column format on mobile */}
                            <div className="w-max sm:ml-auto flex items-center border border-stone-300/80 bg-white shadow-sm">
                                <button
                                    onClick={handleDecrement}
                                    disabled={quantity === 0}
                                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 disabled:opacity-30 transition-colors"
                                >
                                    <span className="text-xs">−</span>
                                </button>
                                <div className="w-10 h-8 bg-stone-50/50 flex items-center justify-center border-x border-stone-100">
                                    <span className="text-sm text-neutral-900 font-['Consolas']">{quantity}</span>
                                </div>
                                <button
                                    onClick={handleAdd}
                                    disabled={product.maxQuantity !== undefined && quantity >= product.maxQuantity}
                                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 disabled:opacity-30 transition-colors"
                                >
                                    <span className="text-xs">+</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Modal */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="bg-stone-100 border-stone-300 text-neutral-900 p-0 w-[92vw] sm:w-full max-w-[672px] max-h-[90vh] overflow-y-auto rounded-none">
                    <VisuallyHidden.Root>
                        <DialogTitle>{product.name}</DialogTitle>
                    </VisuallyHidden.Root>

                    <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-56 md:w-64 h-64 sm:h-auto shrink-0 bg-stone-200 relative">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-stone-200" />
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
                        <div className="flex-1 p-5 md:p-10 flex flex-col">
                            <div className="pb-3 border-b border-stone-200 mb-4">
                                <p className="text-[10px] text-stone-400 uppercase tracking-wide font-['Consolas'] break-all">
                                    Archive Reference: {product.id}
                                </p>
                            </div>
                            <h2 className="text-xl md:text-2xl font-medium text-neutral-900 mb-3">{product.name}</h2>
                            <p className="text-stone-600 text-sm md:text-base leading-6 mb-6 md:mb-8">{product.description}</p>

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