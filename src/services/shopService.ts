import { UserDetails, DeliveryDetails } from '@/types/shop'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'


export async function fetchProducts() {
    const res = await fetch(`${BASE_URL}/products`)
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    return json.data
}

export async function fetchCart(userId: string) {
    const res = await fetch(`${BASE_URL}/cart/${userId}`)
    const json = await res.json()
    if (!json.success) return null
    return json.data
}

export async function addToCart(userId: string, productId: string, quantity: number, productType: string, selectedSize?: string) {
    const res = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity, productType, selectedSize })
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    return json.data
}

export async function updateCartItem(userId: string, productId: string, quantity: number, selectedSize?: string) {
    const res = await fetch(`${BASE_URL}/cart/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity, selectedSize })
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    return json.data
}

export async function removeFromCart(userId: string, productId: string, selectedSize?: string) {
    const res = await fetch(`${BASE_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, selectedSize })
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    return json.data
}

export async function clearCart(userId: string) {
    const res = await fetch(`${BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    return json.data
}

export async function checkout(userId: string, userDetails: UserDetails, deliveryDetails: DeliveryDetails) {
    const res = await fetch(`${BASE_URL}/cart/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userDetails, deliveryDetails })
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.message)
    return json.data
}