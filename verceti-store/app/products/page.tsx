import { productService } from '@/lib/services/product'
import { ProductCard } from '@/components/products/product-card'

export const metadata = {
  title: 'Shop All Products - Verceti',
  description: 'Browse our collection of premium streetwear',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const products = await productService.getAllProducts({
    category: searchParams.category,
    search: searchParams.search,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shop All</h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
