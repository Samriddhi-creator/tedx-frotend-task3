'use client'

import { fetchProducts, fetchCart, addToCart, removeFromCart, updateCartItem, clearCart as clearCartApi } from '@/services/shopService'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product, ProductVariant, PromoCode, BackendCartItem, BackendProduct } from '@/types/shop'
import { promoCodes, products as mockProducts } from '@/data/mockProducts'
import { ObjectId } from 'bson'
import { toast } from 'sonner'

type CartState = {
    items: CartItem[]
    appliedPromo: PromoCode | null
    addItem: (product: Product, variant?: ProductVariant) => Promise<void>
    removeItem: (productId: string, selectedSize?: string) => Promise<void>
    updateQuantity: (productId: string, quantity: number, selectedSize?: string) => Promise<void>
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
    const [dbProducts, setDbProducts] = useState<Product[]>([])

    // Helper to map backend cart items to the frontend structure
    const mapBackendCartToFrontend = (backendItems: BackendCartItem[], productsList: Product[]): CartItem[] => {
        return backendItems.map((item) => {
            // Match product by MongoDB _id or slug
            const prod = productsList.find(p => 
                p.dbId === item.productId || 
                p.id === item.productId || 
                p._id === item.productId
            )
            if (!prod) return null
            const selectedVariant = prod.variants?.find(v => v.value === item.selectedSize)
            return {
                product: prod,
                quantity: item.quantity,
                selectedVariant
            }
        }).filter(Boolean) as CartItem[]
    }

    // Initialize userId
    useEffect(() => {
        const id = localStorage.getItem('tedx-user-id') || new ObjectId().toString()
        if (!localStorage.getItem('tedx-user-id')) {
            localStorage.setItem('tedx-user-id', id)
        }
        setTimeout(() => {
            setUserId(id)
        }, 0)
    }, [])

    // Sync products and cart from backend on mount/userId set
    useEffect(() => {
        if (!userId) return

        const syncWithBackend = async () => {
            try {
                // 1. Fetch products from database
                const backendProducts = await fetchProducts() as BackendProduct[]
                const mappedProducts: Product[] = backendProducts.map((bp) => {
                    const mock = mockProducts.find(mp => mp.id === bp.slug)
                    return {
                        id: bp.slug,
                        dbId: bp._id, // Save the DB _id mapping
                        name: bp.name,
                        description: bp.description || mock?.description || '',
                        price: bp.price,
                        image: bp.images?.[0]?.startsWith('/images/') ? (mock?.image || bp.images[0]) : (bp.images?.[0] || mock?.image || ''),
                        category: mock?.category || (bp.type === 'TICKET' ? 'passages' : 'artifacts'),
                        variants: mock?.variants || (bp.sizes ? bp.sizes.map((s) => ({ label: s, value: s })) : undefined),
                        specifications: mock?.specifications || [],
                        maxQuantity: mock?.maxQuantity
                    }
                })
                setDbProducts(mappedProducts)

                // 2. Fetch the cart for the user
                const cartData = await fetchCart(userId)
                if (cartData && cartData.items) {
                    setItems(mapBackendCartToFrontend(cartData.items, mappedProducts))
                }
            } catch (err) {
                console.error('Failed to sync cart and products with backend:', err)
            }
        }

        syncWithBackend()
    }, [userId])

    const addItem = async (product: Product, variant?: ProductVariant) => {
        // Optimistic UI update — always increment locally first
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

        // Always use addToCart — backend handles both new and existing items (increments qty)
        if (userId) {
            try {
                const updatedCart = await addToCart(
                    userId,
                    product.id,
                    1,
                    product.category === 'passages' ? 'TICKET' : 'MERCH',
                    variant?.value
                )
                if (updatedCart && updatedCart.items && dbProducts.length > 0) {
                    setItems(mapBackendCartToFrontend(updatedCart.items, dbProducts))
                }
            } catch (err) {
                console.error('Failed to sync addItem with backend:', err)
            }
        }
    }

    const removeItem = async (productId: string, selectedSize?: string) => {
        // Optimistic UI update
        setItems(prev => prev.filter(item => 
            !(item.product.id === productId && (item.selectedVariant?.value === selectedSize || (!item.selectedVariant && !selectedSize)))
        ))

        if (userId) {
            try {
                const updatedCart = await removeFromCart(userId, productId, selectedSize)
                if (updatedCart && updatedCart.items && dbProducts.length > 0) {
                    setItems(mapBackendCartToFrontend(updatedCart.items, dbProducts))
                }
            } catch (err) {
                console.error('Failed to sync removeItem with backend:', err)
            }
        }
    }

    const updateQuantity = async (productId: string, quantity: number, selectedSize?: string) => {
        if (quantity === 0) {
            await removeItem(productId, selectedSize)
            return
        }

        // Optimistic UI update
        setItems(prev =>
            prev.map(item =>
                item.product.id === productId && (item.selectedVariant?.value === selectedSize || (!item.selectedVariant && !selectedSize))
                    ? { ...item, quantity }
                    : item
            )
        )

        if (userId) {
            try {
                const updatedCart = await updateCartItem(userId, productId, quantity, selectedSize)
                if (updatedCart && updatedCart.items && dbProducts.length > 0) {
                    setItems(mapBackendCartToFrontend(updatedCart.items, dbProducts))
                }
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
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}