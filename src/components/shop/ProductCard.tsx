'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Product } from '@/types/shop'
import { useCart } from '@/store/cartStore'
import { Card, CardContent } from '@/components/ui/card'

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

    const [selectedVariant, setSelectedVariant] = useState(displayVariants[0] ?? undefined)
    const [expanded, setExpanded] = useState(false)

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
            {/* ── Product Card (click to expand) ── */}
            <Card
                onClick={() => setExpanded(true)}
                className={`rounded-none border-0 border-b border-stone-300/60 shadow-none pb-6 mb-6 cursor-pointer group transition-colors ${quantity > 0 ? 'bg-stone-50/60' : 'bg-transparent'}`}
            >
                <CardContent className="p-0 h-auto md:h-48 flex flex-col sm:flex-row gap-4 md:gap-8">

                    {/* ── Product Image ── */}
                    <div className="w-full sm:w-40 md:w-48 h-48 sm:h-40 md:h-48 bg-stone-100 shrink-0 overflow-hidden relative">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={e => (e.currentTarget.style.display = 'none')}
                            />
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/90 border border-stone-200 px-2 py-0.5">
                            <span className="text-[9px] text-stone-500 uppercase tracking-wide font-['Consolas']">
                                REF: {product.id.slice(0, 4).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* ── Product Info ── */}
                    <div className="flex-1 flex flex-col justify-between px-1 sm:px-0 gap-4 sm:gap-2">
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <div className="max-w-xl">
                                    <h3 className="text-base md:text-xl font-medium text-neutral-900 leading-snug group-hover:text-stone-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-stone-500 text-xs md:text-sm leading-relaxed mt-1">
                                        {product.description}
                                    </p>
                                </div>
                                <span className="text-base md:text-lg font-medium text-neutral-900 shrink-0 mt-1 sm:pt-0.5 whitespace-nowrap">
                                    ₹{product.price}.00
                                </span>
                            </div>
                        </div>

                        {/* ── Variant Selector + Quantity Controls ── */}
                        <div
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 sm:mt-0"
                            onClick={e => e.stopPropagation()}
                        >
                            <select
                                value={selectedVariant?.value}
                                onChange={e => {
                                    const v = displayVariants.find(v => v.value === e.target.value)
                                    if (v) setSelectedVariant(v)
                                }}
                                className="border border-stone-300 text-stone-600 text-xs px-2.5 py-1.5 bg-white cursor-pointer hover:border-stone-400 focus:outline-none min-w-[64px] font-['Consolas'] w-max"
                            >
                                {displayVariants.map(v => (
                                    <option key={v.value} value={v.value}>{v.value}</option>
                                ))}
                            </select>

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

            {/* ── Expanded Product Overlay ── */}
            <AnimatePresence>
                {expanded && (
                    <>
                        {/* Backdrop with blur */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setExpanded(false)}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Expanded Card Panel */}
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, scale: 0.82 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.82 }}
                            transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none"
                        >
                            <div
                                className="bg-stone-100 border border-stone-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <div className="flex justify-end px-5 pt-4">
                                    <button
                                        onClick={() => setExpanded(false)}
                                        className="flex items-center gap-1 text-xs tracking-widest text-stone-400 hover:text-stone-700 transition-colors font-['Consolas']"
                                    >
                                        <X size={13} /> CLOSE
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row">

                                    {/* ── Expanded Image ── */}
                                    <div className="w-full sm:w-64 h-64 sm:h-auto shrink-0 bg-stone-200 relative">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-stone-200" />
                                        )}
                                        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-l border-t border-stone-400" />
                                        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-r border-t border-stone-400" />
                                        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-l border-b border-stone-400" />
                                        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-r border-b border-stone-400" />
                                        <div className="absolute bottom-3 left-3 bg-white/90 border border-stone-200 px-2 py-0.5">
                                            <span className="text-[9px] text-stone-500 uppercase tracking-wide font-['Consolas']">
                                                REF: {product.id.slice(0, 4).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── Expanded Product Details ── */}
                                    <div className="flex-1 p-6 md:p-10 flex flex-col gap-5">
                                        <div className="border-b border-stone-200 pb-3">
                                            <p className="text-[10px] text-stone-400 uppercase tracking-wide font-['Consolas'] break-all">
                                                Archive Reference: {product.id}
                                            </p>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">{product.name}</h2>
                                            <p className="text-stone-600 text-sm leading-6">{product.description}</p>
                                        </div>

                                        <p className="text-2xl font-medium text-neutral-900">₹{product.price}.00</p>

                                        {/* ── Specifications ── */}
                                        {product.specifications && product.specifications.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
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

                                        {/* ── Variant Selector + Quantity Controls (Expanded) ── */}
                                        <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-stone-200">
                                            <select
                                                value={selectedVariant?.value}
                                                onChange={e => {
                                                    const v = displayVariants.find(v => v.value === e.target.value)
                                                    if (v) setSelectedVariant(v)
                                                }}
                                                className="border border-stone-300 text-stone-600 text-xs px-2.5 py-1.5 bg-white cursor-pointer hover:border-stone-400 focus:outline-none min-w-[64px] font-['Consolas']"
                                            >
                                                {displayVariants.map(v => (
                                                    <option key={v.value} value={v.value}>{v.value}</option>
                                                ))}
                                            </select>

                                            <div className="flex items-center border border-stone-300/80 bg-white shadow-sm">
                                                <button
                                                    onClick={handleDecrement}
                                                    disabled={quantity === 0}
                                                    className="w-9 h-9 flex items-center justify-center text-stone-400 hover:text-stone-600 disabled:opacity-30 transition-colors"
                                                >
                                                    <span className="text-sm">−</span>
                                                </button>
                                                <div className="w-12 h-9 bg-stone-50/50 flex items-center justify-center border-x border-stone-100">
                                                    <span className="text-sm text-neutral-900 font-['Consolas']">{quantity}</span>
                                                </div>
                                                <button
                                                    onClick={handleAdd}
                                                    disabled={product.maxQuantity !== undefined && quantity >= product.maxQuantity}
                                                    className="w-9 h-9 flex items-center justify-center text-stone-400 hover:text-stone-600 disabled:opacity-30 transition-colors"
                                                >
                                                    <span className="text-sm">+</span>
                                                </button>
                                            </div>

                                            <span className="text-xs text-stone-400 font-['Consolas']">
                                                {quantity > 0 ? `${quantity} in cart` : 'not in cart'}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}