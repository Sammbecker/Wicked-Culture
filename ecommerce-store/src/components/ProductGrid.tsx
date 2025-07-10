'use client'

import { Product } from '@prisma/client'
import Image from 'next/image'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)

  const addToCart = async (productId: string) => {
    if (!session) {
      alert('Please sign in to add items to cart')
      return
    }

    setLoading(productId)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        alert('Product added to cart!')
      } else {
        alert('Error adding product to cart')
      }
    } catch (error) {
      alert('Error adding product to cart')
    } finally {
      setLoading(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0 || loading === product.id}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading === product.id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCartIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {product.stock === 0 && (
              <p className="text-red-500 text-sm mt-2">Out of Stock</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}