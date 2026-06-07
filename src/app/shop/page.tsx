'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import OrderSummary from '@/components/shop/OrderSummary'
import CheckoutOverlay from '@/components/checkout/CheckoutOverlay'
import { Product, BackendProduct } from '@/types/shop'
import { products as mockProducts } from '@/data/mockProducts'
import { fetchProducts } from '@/services/shopService'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    const getProducts = async () => {
      try {
        const backendProducts = await fetchProducts() as BackendProduct[]
        const mapped = backendProducts.map((bp) => {
          const mock = mockProducts.find(mp => mp.id === bp.slug)
          return {
            id: bp.slug,
            dbId: bp._id,
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
        setProducts(mapped)
      } catch (err) {
        console.error('Error fetching products from backend, falling back to mock data:', err)
        setProducts(mockProducts)
      } finally {
        setLoading(false)
      }
    }
    getProducts()
  }, [])

  const passages = products.filter(p => p.category === 'passages')
  const artifacts = products.filter(p => p.category === 'artifacts')
  const archive = products.filter(p => p.category === 'archive')

  return (
    <main className="min-h-screen bg-stone-100 text-neutral-900">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-stone-100/80 px-4 sm:px-8 py-0 flex items-center justify-center">
        <div className="w-full max-w-[1280px] px-0 sm:px-8 h-14 sm:h-16 flex justify-between items-center">
          <span className="text-xs sm:text-sm font-medium tracking-widest text-neutral-900 uppercase">
            TEDx <span className="text-red-600">×</span> Terra Incognita
          </span>
          <div className="flex gap-3 sm:gap-6 text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider font-['Consolas']">
            <span className="hidden sm:inline">Archive</span>
            <span className="hidden sm:inline">Program</span>
            <span className="text-neutral-900">Acquisitions</span>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1280px] px-4 sm:px-8 py-10 sm:py-16 lg:py-20 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">

          {/* Left — Product list */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 leading-tight">Expedition Supplies</h1>
            <p className="text-stone-500 text-base sm:text-lg font-light mt-3 sm:mt-4 max-w-[672px] leading-7">
              Secure your passage and acquire essential artifacts for the journey into the unknown. All items are logged in the central archive.
            </p>

            {loading ? (
              <p className="text-stone-400 text-sm mt-12">Loading supplies...</p>
            ) : (
              <div className="mt-8 sm:mt-12">
                {passages.length > 0 && (
                  <section className="mb-12 sm:mb-16">
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                      <p className="text-xs text-stone-500 uppercase tracking-[2.4px] font-['Consolas'] shrink-0">Passages</p>
                      <div className="flex-1 h-px bg-stone-300" />
                    </div>
                    <div className="flex flex-col">
                      {passages.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}

                {artifacts.length > 0 && (
                  <section className="mb-12 sm:mb-16">
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                      <p className="text-xs text-stone-500 uppercase tracking-[2.4px] font-['Consolas'] shrink-0">Artifacts</p>
                      <div className="flex-1 h-px bg-stone-300" />
                    </div>
                    <div className="flex flex-col">
                      {artifacts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}

                {archive.length > 0 && (
                  <section className="mb-12 sm:mb-16">
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                      <p className="text-xs text-stone-500 uppercase tracking-[2.4px] font-['Consolas'] shrink-0">Archive Items</p>
                      <div className="flex-1 h-px bg-stone-300" />
                    </div>
                    <div className="flex flex-col">
                      {archive.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* Right — Sticky order summary */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <OrderSummary onCheckout={() => setCheckoutOpen(true)} />
          </div>

        </div>
      </div>

      <CheckoutOverlay
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </main>
  )
}