import { Product, PromoCode } from '@/types/shop'

export const products: Product[] = [
    {
        id: 'session-1-pass',
        name: 'Session 1 Pass',
        description: 'Access to the morning expedition talks and main archive hall.',
        price: 150,
        image: '/images/session1.jpg',
        category: 'passages',
        specifications: [
            'Includes morning coffee',
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
        image: '/images/manifest.jpg',
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
        image: '/images/tshirt.jpg',
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
        image: '/images/tote.jpg',
        category: 'artifacts',
    },
    {
        id: 'coordinate-pin-set',
        name: 'Coordinate Pin Set',
        description: "Three enamel pins detailing the event's geographical markers.",
        price: 75,
        image: '/images/pins.jpg',
        category: 'archive',
        maxQuantity: 3,
    },
]

export const promoCodes: PromoCode[] = [
    { code: 'TEDXEARLY', discountType: 'percentage', discountValue: 10 },
    { code: 'STUDENTPASS', discountType: 'flat', discountValue: 50 },
    { code: 'MERCHDROP', discountType: 'percentage', discountValue: 15 },
]