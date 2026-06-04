'use client'

import { addToCart, removeFromCart, updateCartItem, clearCart as clearCartApi } from '@/services/shopService'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product, ProductVariant, PromoCode } from '@/types/shop'
import { promoCodes } from '@/data/mockProducts'
import { ObjectId } from 'bson'

type CartState =
    {
        items: CartItem[]
        appliedPromo: PromoCode | null
        addItem: (product: Product, variant?: ProductVariant) => Promise<void>
        removeItem: (productId: string) => Promise<void>
        updateQuantity: (productId: string, quantity: number) => Promise<void>
        applyPromo: (code: string) => boolean
        removePromo: () => void
        clearCart: () => Promise<void>
        getSubtotal: () => number
        getDiscount: () => number
        getTotal: () => number

    }

const CartContext = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [userId, setUserId] = useState<string>('')
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)

    useEffect(() => {
        let id = localStorage.getItem('tedx-user-id')
        if (!id) {
            id = new ObjectId().toString()
            localStorage.setItem('tedx-user-id', id)
        }
        setUserId(id)
    }, [])

    const addItem = async (product: Product, variant?: ProductVariant) => {
        setItems(prev => {
            const existing = prev.find(
                item => item.product.id === product.id &&
                    item.selectedVariant?.value === variant?.value
            )
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id &&
                        item.selectedVariant?.value === variant?.value
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { product, quantity: 1, selectedVariant: variant }]
        })

        if (userId) {
            try {
                await addToCart(
                    userId,
                    product.id,
                    1,
                    product.category === 'passages' ? 'TICKET' : 'MERCH',
                    variant?.value
                )
            } catch (err) {
                console.error('Failed to sync addItem with backend:', err)
            }
        }
    }

    const removeItem = async (productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId))

        if (userId) {
            try {
                await removeFromCart(userId, productId)
            } catch (err) {
                console.error('Failed to sync removeItem with backend:', err)
            }
        }
    }

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity === 0) {
            removeItem(productId)
            return
        }
        setItems(prev =>
            prev.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        )

        if (userId) {
            try {
                await updateCartItem(userId, productId, quantity)
            } catch (err) {
                console.error('Failed to sync updateQuantity with backend:', err)
            }
        }
    }

    const applyPromo = (code: string): boolean => {
        const promo = promoCodes.find(p => p.code === code.toUpperCase())
        if (promo) {
            setAppliedPromo(promo)
            return true
        }
        return false
    }

    const removePromo = () => setAppliedPromo(null)
    const clearCart = async () => {
        setItems([])
        setAppliedPromo(null)

        if (userId) {
            try {
                await clearCartApi(userId)
            } catch (err) {
                console.error('Failed to sync clearCart with backend:', err)
            }
        }
    }

    const getSubtotal = () =>
        items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const getDiscount = () => {
        if (!appliedPromo) return 0
        const subtotal = getSubtotal()
        if (appliedPromo.discountType === 'percentage') {
            return (subtotal * appliedPromo.discountValue) / 100
        }
        return appliedPromo.discountValue
    }

    const getTotal = () => getSubtotal() - getDiscount()

    return (
        <CartContext.Provider value={{
            items, appliedPromo,
            addItem, removeItem, updateQuantity,
            applyPromo, removePromo, clearCart,
            getSubtotal, getDiscount, getTotal,
        }
        }>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}