import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded hover:bg-gray-800"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block px-4 py-2 rounded hover:bg-gray-800"
          >
            Products
          </Link>
          <Link
            href="/admin/drops"
            className="block px-4 py-2 rounded hover:bg-gray-800"
          >
            Drops
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-2 rounded hover:bg-gray-800"
          >
            Orders
          </Link>
          <Link
            href="/admin/discounts"
            className="block px-4 py-2 rounded hover:bg-gray-800"
          >
            Discounts
          </Link>
          <Link
            href="/admin/analytics"
            className="block px-4 py-2 rounded hover:bg-gray-800"
          >
            Analytics
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 rounded hover:bg-gray-800 mt-8"
          >
            ← Back to Store
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}
