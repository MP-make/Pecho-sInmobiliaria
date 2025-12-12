'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Admin Header */}
      <header className="bg-[#3B332B] text-white px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="font-sans font-bold text-lg uppercase tracking-widest">
            Panel Admin
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/admin/properties" className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide">
              Propiedades
            </Link>
            <Link href="/admin/carousel" className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide">
              Carrusel
            </Link>
            <Link href="/admin/leads" className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide">
              Mensajes
            </Link>
            <Link href="/admin/users" className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide">
              Usuarios
            </Link>
            <Link href="/" className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide">
              Ver Sitio
            </Link>
            <button
              onClick={handleLogout}
              className="font-mono text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition uppercase tracking-wide"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="p-8">
        {children}
      </main>
    </div>
  )
}