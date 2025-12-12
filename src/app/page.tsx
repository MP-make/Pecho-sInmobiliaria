import PropertyCard from '@/components/PropertyCard';
import HeroCarousel from '@/components/HeroCarousel';
import { prisma } from '@/lib/prisma';

async function getProperties() {
  return await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

async function getHeroImages() {
  const images = await prisma.heroImage.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
  
  if (images.length === 0) {
    return [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
    ];
  }
  
  return images.map((img: any) => img.url);
}

export default async function Home() {
  const properties = await getProperties();
  const heroImages = await getHeroImages();

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 py-4 sm:py-6">
        <span className="font-sans text-xs sm:text-sm font-bold text-[#2C2621] uppercase tracking-widest">
          Pecho&apos;s Inmobiliaria
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="font-mono text-sm text-[#2C2621] hover:opacity-70 transition-opacity duration-300 underline underline-offset-4">
            Servicios
          </a>
          <a href="#contacto" className="font-mono text-sm text-[#2C2621] hover:opacity-70 transition-opacity duration-300 underline underline-offset-4">
            Contacto
          </a>
          <a 
            href="#" 
            className="rounded-none border-2 border-[#3B332B] px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#3B332B] hover:bg-[#3B332B] hover:text-white"
          >
            Reservar
          </a>
        </nav>
        {/* Mobile menu button */}
        <a href="#contacto" className="md:hidden rounded-none border-2 border-[#3B332B] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#3B332B] hover:bg-[#3B332B] hover:text-white">
          Contacto
        </a>
      </header>

      {/* Hero Section con Carrusel */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mx-4 sm:mx-8 md:mx-16 rounded-lg">
        <HeroCarousel images={heroImages} interval={5000} />
        <div className="absolute inset-0 bg-black/20 z-[1]"></div>
        <h1 className="font-sans text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight text-center z-10 leading-tight px-4">
          Alquiler de Casas en<br />Pisco - Perú
        </h1>
      </section>

      {/* Properties Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="space-y-0">
          {properties.length > 0 ? (
            properties.map((p: any, index: number) => (
              <PropertyCard key={p.id} property={p} reverse={index % 2 === 1} />
            ))
          ) : (
            <p className="font-mono text-center text-[#2C2621] uppercase tracking-wide py-16">
              No hay propiedades disponibles
            </p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="px-4 sm:px-8 md:px-16 py-8 sm:py-12 md:py-16 bg-[#E8E2D9]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/2">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2621] uppercase tracking-tight mb-4">
              Contáctanos
            </h2>
            <p className="font-mono text-sm text-[#2C2621] tracking-wide">
              Separa tu cita para alguna visita a la casa en elección
            </p>
          </div>
          <div className="md:w-1/2 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Nombre (obligatorio)</label>
                <input type="text" placeholder="Nombre" className="w-full mt-2 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/50" />
              </div>
              <div className="flex-1">
                <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">&nbsp;</label>
                <input type="text" placeholder="Apellido" className="w-full mt-2 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/50" />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Correo electrónico (obligatorio)</label>
              <input type="email" className="w-full mt-2 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621]" />
            </div>
            <div>
              <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Mensaje (obligatorio)</label>
              <textarea rows={3} className="w-full mt-2 p-3 bg-transparent border border-[#2C2621] rounded-lg focus:outline-none font-mono text-sm text-[#2C2621] resize-none"></textarea>
            </div>
            <button className="rounded-none border-2 border-[#3B332B] px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#3B332B] hover:bg-[#3B332B] hover:text-white">
              Enviar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
