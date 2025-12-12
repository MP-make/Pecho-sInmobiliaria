'use client'

import { useState } from 'react';
import ContactForm from '@/components/ContactForm';

interface Property {
  id: string;
  title: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  amenities: { id: string; name: string }[];
  propertyImages: { id: string; url: string; isCover: boolean }[];
}

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const coverImage = property.propertyImages.find(img => img.isCover)?.url || property.imageUrl || '/placeholder.jpg';
  const allImages = property.propertyImages.length > 0 
    ? property.propertyImages 
    : [{ id: '1', url: coverImage, isCover: true }];

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <a href="/" className="font-sans text-sm text-[#2C2621] uppercase tracking-wider">Pecho&apos;s Inmobiliaria</a>
        <nav className="flex gap-8">
          <a href="/#contacto" className="font-sans text-sm text-[#2C2621] hover:opacity-70 transition">Contacto</a>
          <a href="/" className="font-sans text-sm text-[#2C2621] hover:opacity-70 transition">Reservar</a>
        </nav>
      </header>

      {/* Property Detail */}
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 h-[50vh] md:h-screen sticky top-0">
          <img 
            src={coverImage} 
            alt={property.title} 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setSelectedImage(coverImage)}
          />
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-8 md:p-16">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#2C2621] uppercase tracking-tight leading-tight mb-8">
            {property.title}
          </h1>

          <p className="font-mono text-xs text-[#2C2621] uppercase tracking-wide mb-4">
            En nuestra casa contamos con:
          </p>

          <ul className="font-mono text-sm text-[#2C2621] uppercase tracking-wide space-y-2 mb-8">
            {property.amenities.length > 0 ? (
              property.amenities.map(amenity => (
                <li key={amenity.id}>• {amenity.name}</li>
              ))
            ) : (
              <>
                <li>• 2 HABITACIONES</li>
                <li>• 3 BAÑOS</li>
                <li>• 1 SALA COMEDOR</li>
                <li>• ETC.</li>
              </>
            )}
          </ul>

          {property.description && (
            <p className="font-mono text-sm text-[#2C2621] tracking-wide mb-8">
              {property.description}
            </p>
          )}

          <p className="font-mono text-2xl text-[#2C2621] tracking-wide mb-8">
            ${property.price.toLocaleString()}
          </p>

          {/* Gallery Grid */}
          {allImages.length > 1 && (
            <div className="mb-12">
              <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-4">
                Galería
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {allImages.map(image => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={property.title}
                    className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition"
                    onClick={() => setSelectedImage(image.url)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contact Form */}
          <div className="border-t border-[#2C2621]/20 pt-8">
            <h2 className="font-sans text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">
              Contáctanos
            </h2>
            <ContactForm propertyId={property.id} propertyTitle={property.title} />
          </div>

          <a href="/" className="inline-block mt-8 font-mono text-sm text-[#2C2621] underline underline-offset-4 hover:opacity-70 transition">
            ← Volver al catálogo
          </a>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Selected" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/1234567890?text=Hola, estoy interesado en la propiedad ${encodeURIComponent(property.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}