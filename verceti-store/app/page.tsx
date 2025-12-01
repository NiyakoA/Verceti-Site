import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
        {/* Add your hero image here */}
        <div className="container mx-auto px-4 z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            PREMIUM STREETWEAR
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Exclusive drops. Limited quantities. Elevated style.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/drops"
              className="bg-white text-black px-8 py-3 font-semibold hover:bg-gray-200 transition-colors"
            >
              View Drops
            </Link>
            <Link
              href="/products"
              className="border border-white px-8 py-3 font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Shop All
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Drops */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Drops</h2>
            <Link
              href="/drops"
              className="flex items-center gap-2 text-sm font-medium hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Drop cards will be populated dynamically */}
            <div className="bg-white p-6 text-center">
              <div className="aspect-square bg-gray-200 mb-4" />
              <h3 className="font-semibold mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600">Check back for upcoming drops</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm font-medium hover:underline"
            >
              Shop All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Product cards will be populated dynamically */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gray-200 mb-4 group-hover:opacity-75 transition-opacity" />
              <h3 className="font-semibold mb-1">Product Name</h3>
              <p className="text-sm text-gray-600">$99.00</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Community</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get early access to drops and exclusive offers
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-gray-200 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  )
}
