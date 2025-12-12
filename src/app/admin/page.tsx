import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#2C2621] uppercase tracking-tight mb-4">
        Dashboard
      </h1>
      <p className="font-mono text-sm text-[#2C2621]/60 uppercase tracking-wide mb-8">
        Panel de administración - Inmobiliaria Pecho's
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Properties Card */}
        <Link href="/admin/properties" className="block">
          <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-[#2C2621]/20 hover:border-[#2C2621] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C2621]">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase">
                Propiedades
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#2C2621]/70 uppercase tracking-wide">
              Gestiona las casas disponibles para alquiler
            </p>
          </div>
        </Link>

        {/* Carousel Card */}
        <Link href="/admin/carousel" className="block">
          <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-[#2C2621]/20 hover:border-[#2C2621] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C2621]">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase">
                Carrusel
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#2C2621]/70 uppercase tracking-wide">
              Administra las imágenes del hero principal
            </p>
          </div>
        </Link>

        {/* Leads/Messages Card */}
        <Link href="/admin/leads" className="block">
          <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-[#2C2621]/20 hover:border-[#2C2621] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C2621]">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase">
                Mensajes
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#2C2621]/70 uppercase tracking-wide">
              Consultas y solicitudes de clientes
            </p>
          </div>
        </Link>

        {/* Users Card */}
        <Link href="/admin/users" className="block">
          <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-[#2C2621]/20 hover:border-[#2C2621] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C2621]">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase">
                Usuarios
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#2C2621]/70 uppercase tracking-wide">
              Administra los usuarios del sistema
            </p>
          </div>
        </Link>

        {/* View Site Card */}
        <Link href="/" className="block">
          <div className="bg-[#3B332B] text-white p-6 sm:p-8 rounded-lg border-2 border-[#3B332B] hover:bg-[#5A4D41] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 16 16 12 12 8"></polyline>
                <line x1="8" x2="16" y1="12" y2="12"></line>
              </svg>
              <h2 className="font-sans text-xl font-bold uppercase">
                Ver sitio
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm opacity-90 uppercase tracking-wide">
              Ir a la página principal del sitio web
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8 sm:mt-12">
        <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-4">
          Acceso rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/properties/new" className="block">
            <div className="bg-green-50 p-4 sm:p-6 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="8" y2="16"></line>
                  <line x1="8" x2="16" y1="12" y2="12"></line>
                </svg>
                <div>
                  <h3 className="font-sans font-bold text-[#2C2621] uppercase text-sm sm:text-base">
                    Nueva Propiedad
                  </h3>
                  <p className="font-mono text-xs text-[#2C2621]/70 uppercase">
                    Agregar casa nueva
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/carousel" className="block">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-300">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                  <line x1="16" x2="22" y1="5" y2="5"></line>
                  <line x1="19" x2="19" y1="2" y2="8"></line>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                <div>
                  <h3 className="font-sans font-bold text-[#2C2621] uppercase text-sm sm:text-base">
                    Subir Imagen Hero
                  </h3>
                  <p className="font-mono text-xs text-[#2C2621]/70 uppercase">
                    Actualizar carrusel principal
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}