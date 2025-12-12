import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Admin Header */}
      <header className="bg-[#3B332B] text-white px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="font-sans font-bold text-lg uppercase tracking-widest">
            Panel Admin
          </Link>
          <nav className="flex gap-6">
            <Link href="/admin/properties" className="font-mono text-sm hover:opacity-70 transition">
              Propiedades
            </Link>
            <Link href="/admin/carousel" className="font-mono text-sm hover:opacity-70 transition">
              Carrusel
            </Link>
            <Link href="/" className="font-mono text-sm hover:opacity-70 transition">
              Ver Sitio
            </Link>
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