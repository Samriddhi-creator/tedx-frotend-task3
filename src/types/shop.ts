export type ProductCategory = 'passages' | 'artifacts' | 'archive'

export interface BackendCartItem {
    productId: string
    quantity: number
    productType: string
    priceAtPurchase: number
    selectedSize?: string
}

export interface BackendProduct {
    _id: string
    slug: string
    name: string
    description?: string
    price: number
    type: string
    images?: string[]
    sizes?: string[]
}

export type ProductVariant =
    {
        label: string
        value: string
    }

export type Product =
    {
        id: string
        dbId?: string
        _id?: string
        name: string
        description: string
        price: number
        image: string
        category: ProductCategory
        variants?: ProductVariant[]
        specifications?: string[]
        maxQuantity?: number
    }

export type CartItem =
    {
        product: Product
        quantity: number
        selectedVariant?: ProductVariant
    }

export type PromoCode =
    {
        code: string
        discountType: 'percentage' | 'flat'
        discountValue: number
    }

export type UserDetails =
    {
        fullName: string
        email: string
        phone: string
    }
export type DeliveryDetails = {
    type: 'in-campus' | 'out-of-campus'
    hostel?: string
    roomNumber?: string
    notes?: string
    addressLine?: string
    city?: string
    state?: string
    postalCode?: string
}