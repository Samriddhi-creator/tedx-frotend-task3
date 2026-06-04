export type ProductCategory = 'passages' | 'artifacts' | 'archive'

export type ProductVariant =
    {
        label: string
        value: string
    }

export type Product =
    {
        id: string
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