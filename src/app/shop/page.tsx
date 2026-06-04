'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import OrderSummary from '@/components/shop/OrderSummary'
import CheckoutOverlay from '@/components/checkout/CheckoutOverlay'
import { fetchProducts } from '@/services/shopService'
import { Product } from '@/types/shop'


export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
      .then(data => {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.slug,
          name: p.name,
          description: p.description ?? '',
          price: p.price,
          image: p.images?.[0] ?? '',
          category: p.type === 'TICKET' ? 'passages' : p.type === 'MERCH' ? 'artifacts' : 'archive',
          variants: p.sizes?.length
            ? p.sizes.map((s: string) => ({ label: s, value: s }))
            : undefined,
        }))
        setProducts(mapped)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const passages = products.filter(p => p.category === 'passages')
  const artifacts = products.filter(p => p.category === 'artifacts')
  const archive = products.filter(p => p.category === 'archive')

  return (
    <main className="min-h-screen bg-[#f0ede6] text-[#1a1a1a]">
      <nav className="border-b border-[#e0ddd8] px-8 py-4 flex items-center justify-between">
        <span className="text-sm tracking-widest text-[#1a1a1a]">TEDX × TERRA INCOGNITA</span>
        <div className="flex gap-8 text-xs tracking-widest text-[#888]">
          <span>ARCHIVE</span>
          <span>PROGRAM</span>
          <span className="text-[#1a1a1a]">ACQUISITIONS</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12 flex gap-12">
        <div className="flex-1">
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Expedition Supplies</h1>
          <p className="text-[#888] text-sm mb-12">
            Secure your passage and acquire essential artifacts for the journey into the unknown.
          </p>

          {loading ? (
            <p className="text-[#aaa] text-sm">Loading supplies...</p>
          ) : (
            <>
              {passages.length > 0 && (
                <section className="mb-12">
                  <p className="text-xs tracking-widest text-[#aaa] mb-4">PASSAGES</p>
                  <div className="flex flex-col">
                    {passages.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </section>
              )}

              {artifacts.length > 0 && (
                <section className="mb-12">
                  <p className="text-xs tracking-widest text-[#aaa] mb-4">ARTIFACTS</p>
                  <div className="flex flex-col">
                    {artifacts.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </section>
              )}

              {archive.length > 0 && (
                <section className="mb-12">
                  <p className="text-xs tracking-widest text-[#aaa] mb-4">ARCHIVE ITEMS</p>
                  <div className="flex flex-col">
                    {archive.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        <div className="w-80 shrink-0">
          <OrderSummary onCheckout={() => setCheckoutOpen(true)} />
        </div>
      </div>

      <CheckoutOverlay
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </main>
  )
}