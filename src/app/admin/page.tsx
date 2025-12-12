import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-sans text-3xl font-bold text-[#2C2621] uppercase tracking-tight mb-8">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Properties Card */}
        <Link href="/admin/properties" className="block">
          <div className="bg-white p-8 rounded-lg border border-[#2C2621]/20 hover:border-[#2C2621] transition">
            <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase mb-2">
              Propiedades
            </h2>
            <p className="font-mono text-sm text-[#2C2621]/70">
              Gestiona las casas disponibles para alquiler
            </p>
          </div>
        </Link>

        {/* Carousel Card */}
        <Link href="/admin/carousel" className="block">
          <div className="bg-white p-8 rounded-lg border border-[#2C2621]/20 hover:border-[#2C2621] transition">
            <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase mb-2">
              Carrusel
            </h2>
            <p className="font-mono text-sm text-[#2C2621]/70">
              Administra las imágenes del hero principal
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}