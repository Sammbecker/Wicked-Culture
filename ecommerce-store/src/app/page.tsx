import { prisma } from '@/lib/db'
import ProductGrid from '@/components/ProductGrid'
import HeroSection from '@/components/HeroSection'
import NewsletterSignup from '@/components/NewsletterSignup'

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return products
}

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })
  return products
}

export default async function Home() {
  const [products, featuredProducts] = await Promise.all([
    getProducts(),
    getFeaturedProducts(),
  ])

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Featured Products
            </h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            All Products
          </h2>
          <ProductGrid products={products} />
        </div>
      </section>

      <NewsletterSignup />
    </div>
  )
}
