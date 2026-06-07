import { Product, PromoCode } from '@/types/shop'

export const products: Product[] = [
    {
        id: 'session-1-pass',
        name: 'Session 1 Pass',
        description: 'Access to the morning expedition talks and main archive hall.',
        price: 150,
        image: 'https://i.pinimg.com/736x/64/e6/33/64e633b8118b2264aaaf3abe493f91bd.jpg',
        category: 'passages',
        specifications: [
            'Arrival entry',
            'Exclusive coordinate map',
            'Sector A seating',
        ],
    },

    {
        id: 'complete-manifest-pass',
        name: 'Complete Manifest Pass',
        description: 'Full access to all sessions, workshops, and the evening symposium.',
        price: 350,
        image: 'https://i.pinimg.com/736x/2a/de/a5/2adea5e69360a7f29aa283c8d9d0a43b.jpg',
        category: 'passages',
        specifications: [
            'All session access',
            'Workshop entry',
            'Evening symposium',
            'Priority seating',
        ],
    },
    {
        id: 'ti-tshirt',
        name: 'Terra Incognita T-Shirt',
        description: 'Heavyweight cotton standard issue apparel with minimal coordinate prints.',
        price: 450,
        image: 'https://i.pinimg.com/736x/d8/db/a0/d8dba0d1826ea3b8bb5c8243fd60d6e4.jpg',
        category: 'artifacts',
        variants: [
            { label: 'Small', value: 'S' },
            { label: 'Medium', value: 'M' },
            { label: 'Large', value: 'L' },
            { label: 'X-Large', value: 'XL' },
        ],
    },
    {
        id: 'expedition-tote',
        name: 'Expedition Tote',
        description: 'Durable canvas carry-all for field notes and collected artifacts.',
        price: 250,
        image: 'https://i.pinimg.com/736x/3a/66/fe/3a66fea78bff57af666e41d43d0e4705.jpg',
        category: 'artifacts',
    },
    {
        id: 'coordinate-pin-set',
        name: 'Coordinate Pin Set',
        description: "Three enamel pins detailing the event's geographical markers.",
        price: 75,
        image: 'https://i.pinimg.com/webp/736x/74/1c/7d/741c7dcd1fbf62ab0b958c2d64ddde8a.webp',
        category: 'archive',
        maxQuantity: 3,
    },
]

export const promoCodes: PromoCode[] = [
    { code: 'TEDXEARLY', discountType: 'percentage', discountValue: 10 },
    { code: 'STUDENTPASS', discountType: 'flat', discountValue: 50 },
    { code: 'MERCHDROP', discountType: 'percentage', discountValue: 15 },
]