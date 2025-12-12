'use client'

import { useState } from 'react';
import ContactForm from '@/components/ContactForm';

interface Property {
  id: string;
  title: string;
  price: number;
  pricePerMonth?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  rentalType?: string;
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  address?: string | null;
  amenities: { id: string; name: string }[];
  propertyImages: { id: string; url: string; isCover: boolean }[];
}

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [rentalType, setRentalType] = useState<'DAILY' | 'MONTHLY'>(
    (property.rentalType as 'DAILY' | 'MONTHLY') || 'DAILY'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const coverImage = property.propertyImages.find(img => img.isCover)?.url || property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600';
  const allImages = property.propertyImages.length > 0 
    ? property.propertyImages.map(img => img.url)
    : [coverImage];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const phoneNumber = '51907326121';
  const isDaily = rentalType === 'DAILY';
  const priceLabel = isDaily ? '/ noche' : '/ mes';

  const handleRentalTypeChange = (type: 'DAILY' | 'MONTHLY') => {
    setRentalType(type);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Property Title and Controls */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-sans text-3xl md:text-4xl font-bold text-[#2C2621] uppercase tracking-tight mb-2">
              {property.title}
            </h1>
            <p className="font-mono text-sm text-[#2C2621]/60 uppercase tracking-wide">
              📍 Pisco, Perú
            </p>
          </div>
          
          {/* Right Controls: Rental Type Dropdown + Volver Button */}
          <div className="flex items-center gap-3">
            {/* Rental Type Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-4 px-6 py-3 border-2 border-[#2C2621] bg-white hover:bg-[#2C2621]/5 transition-all duration-300 min-w-[240px]"
              >
                <div className="text-left">
                  <div className="font-sans text-sm font-bold uppercase tracking-wide text-[#2C2621]">
                    {isDaily ? 'Por días' : 'Por meses'}
                  </div>
                  <div className="font-mono text-xs text-[#2C2621]/60">
                    {isDaily ? 'Corto plazo / Vacacional' : 'Temporada / Medio plazo'}
                  </div>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#2C2621] shadow-lg z-20">
                  <button
                    onClick={() => handleRentalTypeChange('DAILY')}
                    className={`w-full px-6 py-3 text-left hover:bg-[#2C2621]/10 transition-colors duration-200 ${
                      isDaily ? 'bg-[#2C2621]/5' : ''
                    }`}
                  >
                    <div className="font-sans text-sm font-bold uppercase tracking-wide text-[#2C2621]">
                      Por días
                    </div>
                    <div className="font-mono text-xs text-[#2C2621]/60">
                      Corto plazo / Vacacional
                    </div>
                  </button>
                  <button
                    onClick={() => handleRentalTypeChange('MONTHLY')}
                    className={`w-full px-6 py-3 text-left hover:bg-[#2C2621]/10 transition-colors duration-200 border-t border-[#2C2621]/20 ${
                      !isDaily ? 'bg-[#2C2621]/5' : ''
                    }`}
                  >
                    <div className="font-sans text-sm font-bold uppercase tracking-wide text-[#2C2621]">
                      Por meses
                    </div>
                    <div className="font-mono text-xs text-[#2C2621]/60">
                      Temporada / Medio plazo
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            {/* Volver Button */}
            <a 
              href="/" 
              className="rounded-none border-2 border-[#2C2621] px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#2C2621] hover:bg-[#2C2621] hover:text-[#F2EFE9] whitespace-nowrap h-[60px] flex items-center"
            >
              Volver
            </a>
          </div>
        </div>

        {/* Info text about rental type */}
        <div className="mb-6 bg-white border border-[#2C2621]/10 p-4 rounded-lg">
          <p className="font-mono text-xs text-[#2C2621]/70 leading-relaxed">
            {isDaily ? (
              <>
                <strong>Alquiler por días:</strong> Estancias breves (días/semanas), flexible y más caro por día. 
                Ideal para turistas o necesidades puntuales, con gestión intensiva y regulaciones turísticas.
              </>
            ) : (
              <>
                <strong>Alquiler por meses:</strong> Estancias más largas (32 días a 11 meses). 
                Para estudios o trabajo, ofrece ingresos más estables y menos gestión. Se rige por leyes de alquiler temporal, no habitual.
              </>
            )}
          </p>
        </div>

        {/* Images and Booking Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Image Carousel - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[400px] md:h-[500px] bg-[#2C2621]/5 rounded-lg overflow-hidden">
              <img 
                src={allImages[currentImageIndex]} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#2C2621] p-3 rounded-full transition-all duration-300 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#2C2621] p-3 rounded-full transition-all duration-300 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-4 z-10 bg-[#2C2621]/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg font-mono text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}

              {/* View all photos button */}
              <button 
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-white border-2 border-[#2C2621] text-[#2C2621] font-mono text-xs uppercase tracking-widest hover:bg-[#2C2621] hover:text-white transition-all duration-300"
              >
                Ver todas las fotos
              </button>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      currentImageIndex === index ? 'border-[#2C2621] scale-105' : 'border-[#2C2621]/30 hover:border-[#2C2621]/60'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Booking Card - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-4xl font-bold text-[#2C2621]">
                    S/ {property.price.toLocaleString()}
                  </span>
                  <span className="font-mono text-base text-[#2C2621]/60">
                    {priceLabel}
                  </span>
                </div>
                <p className="font-mono text-xs text-green-600 uppercase tracking-wide">
                  ✓ Muy buen precio
                </p>
              </div>

              {/* Check-in/out */}
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-[#2C2621]/30 p-3 rounded">
                    <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                      Entrada
                    </label>
                    <input 
                      type="date"
                      className="w-full bg-transparent font-mono text-sm text-[#2C2621] focus:outline-none"
                    />
                  </div>
                  <div className="border-2 border-[#2C2621]/30 p-3 rounded">
                    <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                      Salida
                    </label>
                    <input 
                      type="date"
                      className="w-full bg-transparent font-mono text-sm text-[#2C2621] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Static guest info */}
                <div className="border-2 border-[#2C2621]/30 p-3 rounded bg-[#F2EFE9]/30">
                  <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                    Capacidad máxima
                  </label>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span className="font-mono text-sm font-bold text-[#2C2621]">
                      {property.maxGuests ? `${property.maxGuests} huéspedes` : 'Consultar disponibilidad'}
                    </span>
                  </div>
                </div>

                {/* Property details */}
                {(property.bedrooms || property.bathrooms) && (
                  <div className="grid grid-cols-2 gap-3">
                    {property.bedrooms && (
                      <div className="flex items-center gap-2 bg-[#F2EFE9]/30 p-3 rounded border border-[#2C2621]/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 4v16"></path>
                          <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                          <path d="M2 17h20"></path>
                          <path d="M6 8V4"></path>
                        </svg>
                        <span className="font-mono text-xs text-[#2C2621]">
                          {property.bedrooms} {property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
                        </span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-2 bg-[#F2EFE9]/30 p-3 rounded border border-[#2C2621]/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                          <line x1="10" x2="8" y1="5" y2="7"></line>
                          <line x1="2" x2="22" y1="12" y2="12"></line>
                          <line x1="7" x2="7" y1="19" y2="21"></line>
                          <line x1="17" x2="17" y1="19" y2="21"></line>
                        </svg>
                        <span className="font-mono text-xs text-[#2C2621]">
                          {property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reserve Button */}
              <button className="w-full rounded-none border-2 border-[#3B332B] px-6 py-3 font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 bg-[#3B332B] text-white hover:bg-transparent hover:text-[#3B332B] mb-3">
                Reserva ahora
              </button>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${phoneNumber}?text=Hola, estoy interesado en la propiedad: ${encodeURIComponent(property.title)} - Tipo de alquiler: ${isDaily ? 'Por días' : 'Por meses'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-none font-sans font-bold uppercase tracking-widest text-sm hover:bg-[#128C7E] transition-all duration-300 mb-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Igualamos el precio
              </a>

              <p className="font-mono text-xs text-[#2C2621]/50 text-center uppercase tracking-wide mb-3">
                o llámanos al: +51 907 326 121
              </p>

              <p className="font-mono text-xs text-[#2C2621]/60 text-center">
                No se hará ningún cargo todavía
              </p>
            </div>
          </div>
        </div>

        {/* Description and Features Below */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Características */}
            <div>
              <h2 className="font-sans text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-6 border-b-2 border-[#2C2621]/20 pb-4">
                En nuestra casa contamos con:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.length > 0 ? (
                  property.amenities.map((amenity: any) => (
                    <div key={amenity.id} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-[#2C2621]/10">
                      <div className="w-2 h-2 bg-[#2C2621] rounded-full flex-shrink-0"></div>
                      <span className="font-mono text-sm text-[#2C2621] uppercase tracking-wide">
                        {amenity.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-[#2C2621]/10">
                      <div className="w-2 h-2 bg-[#2C2621] rounded-full flex-shrink-0"></div>
                      <span className="font-mono text-sm text-[#2C2621] uppercase tracking-wide">3 Habitaciones</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-[#2C2621]/10">
                      <div className="w-2 h-2 bg-[#2C2621] rounded-full flex-shrink-0"></div>
                      <span className="font-mono text-sm text-[#2C2621] uppercase tracking-wide">2 Baños</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="font-sans text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-6 border-b-2 border-[#2C2621]/20 pb-4">
                  Sobre este alojamiento
                </h2>
                <p className="font-mono text-sm text-[#2C2621] leading-relaxed bg-white p-6 rounded-lg border border-[#2C2621]/10">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Contact Form on the Right */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg shadow-lg">
              <h3 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">
                Solicitar información
              </h3>
              <ContactForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for all photos */}
      {showAllPhotos && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" 
          onClick={() => setShowAllPhotos(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#F2EFE9] transition-colors duration-300 z-10"
            onClick={() => setShowAllPhotos(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="max-w-6xl w-full max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {allImages.map((image: string, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${property.title} - Imagen ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#2C2621]/80 text-white px-3 py-1 rounded font-mono text-xs">
                    {index + 1} / {allImages.length}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Floating WhatsApp Button - Solo móvil */}
      <a
        href={`https://wa.me/${phoneNumber}?text=Hola, estoy interesado en la propiedad: ${encodeURIComponent(property.title)} - Tipo de alquiler: ${isDaily ? 'Por días' : 'Por meses'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 z-40 lg:hidden"
        title="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}