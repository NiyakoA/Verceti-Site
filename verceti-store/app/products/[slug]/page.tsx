import { notFound } from 'next/navigation'
import { productService } from '@/lib/services/product'
import { ProductImages } from '@/components/products/product-images'
import { ProductInfo } from '@/components/products/product-info'
import { ProductReviews } from '@/components/products/product-reviews'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await productService.getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - Verceti`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.altText,
      })),
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await productService.getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <ProductImages images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      {product.sizeGuide && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Size Guide</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{product.sizeGuide}</p>
          </div>
        </div>
      )}

      <ProductReviews productId={product.id} reviews={product.reviews} />
    </div>
  )
}
