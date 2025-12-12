'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // No mostrar header en la página de login
  const isLoginPage = pathname === '/admin/login'

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Admin Header */}
      <header className="bg-[#3B332B] text-white px-4 sm:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="font-sans font-bold text-base sm:text-lg uppercase tracking-widest">
            Panel Admin
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-6 items-center">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 flex flex-col gap-3 pb-2">
            <Link 
              href="/admin/properties" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide py-2 border-b border-white/20"
            >
              Propiedades
            </Link>
            <Link 
              href="/admin/carousel" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide py-2 border-b border-white/20"
            >
              Carrusel
            </Link>
            <Link 
              href="/admin/leads" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide py-2 border-b border-white/20"
            >
              Mensajes
            </Link>
            <Link 
              href="/admin/users" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide py-2 border-b border-white/20"
            >
              Usuarios
            </Link>
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-sm hover:opacity-70 transition uppercase tracking-wide py-2 border-b border-white/20"
            >
              Ver Sitio
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleLogout()
              }}
              className="font-mono text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition uppercase tracking-wide text-left"
            >
              Salir
            </button>
          </nav>
        )}
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}