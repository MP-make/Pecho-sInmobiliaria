'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PropertyFormProps {
  propertyId?: string
}

interface ImageData {
  url: string
  file: File | null
  preview?: string
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    pricePerMonth: '',
    description: '',
    status: 'AVAILABLE',
    rentalType: 'DAILY',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    mapUrl: '',
    whatsappNumber: '',
  })
  const [images, setImages] = useState<ImageData[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState('')

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  async function fetchProperty() {
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`)
      const data = await res.json()
      setFormData({
        title: data.title,
        price: data.price.toString(),
        pricePerMonth: data.pricePerMonth?.toString() || '',
        description: data.description || '',
        status: data.status,
        rentalType: data.rentalType || 'DAILY',
        maxGuests: data.maxGuests?.toString() || '',
        bedrooms: data.bedrooms?.toString() || '',
        bathrooms: data.bathrooms?.toString() || '',
        address: data.address || '',
        mapUrl: data.mapUrl || '',
        whatsappNumber: data.whatsappNumber || '',
      })
      
      if (data.propertyImages && data.propertyImages.length > 0) {
        setImages(data.propertyImages.map((img: any) => ({ 
          url: img.url, 
          file: null,
          preview: img.url 
        })))
      }
      
      if (data.amenities && data.amenities.length > 0) {
        setAmenities(data.amenities.map((a: any) => a.name))
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = propertyId ? `/api/admin/properties/${propertyId}` : '/api/admin/properties'

      const processedImages = await Promise.all(images.map(async (img) => {
        let file = null
        if (img.file) {
          file = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(img.file!)
          })
        }
        return { url: img.url, file }
      }))

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        pricePerMonth: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : null,
        maxGuests: formData.maxGuests ? parseInt(formData.maxGuests) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        images: processedImages,
        amenities: amenities,
      }

      const res = await fetch(url, {
        method: propertyId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/properties')
      } else {
        const error = await res.json()
        alert('Error: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving property:', error)
      alert('Error al guardar la propiedad')
    } finally {
      setLoading(false)
    }
  }

  function handleImageAdd() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setImages([...images, {
            url: '',
            file: file,
            preview: event.target?.result as string
          }])
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  function handleImageRemove(index: number) {
    setImages(images.filter((_, i) => i !== index))
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2))
    }
  }

  function handleAddAmenity() {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity('')
    }
  }

  function handleRemoveAmenity(index: number) {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(1, images.length))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(1, images.length)) % Math.max(1, images.length))
  }

  const isDaily = formData.rentalType === 'DAILY'
  const priceLabel = isDaily ? '/ noche' : '/ mes'
  const displayPrice = isDaily ? formData.price : (formData.pricePerMonth || formData.price)

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#F2EFE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header con botones */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#2C2621] uppercase tracking-tight">
            {propertyId ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-none border-2 border-[#2C2621] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#2C2621] hover:bg-[#2C2621] hover:text-[#F2EFE9]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-none border-2 border-[#3B332B] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-[#3B332B] text-white hover:bg-[#5A4D41] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Título editable */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Título de la propiedad"
            className="w-full font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2C2621] uppercase tracking-tight bg-white border-2 border-[#2C2621]/20 p-3 sm:p-4 rounded-lg focus:outline-none focus:border-[#2C2621] placeholder:text-[#2C2621]/30"
          />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="📍 Dirección (Ej: Av. San Martín 123, Pisco)"
            className="w-full mt-2 sm:mt-3 font-mono text-xs sm:text-sm text-[#2C2621]/60 uppercase tracking-wide bg-white border border-[#2C2621]/20 p-2 sm:p-3 rounded-lg focus:outline-none focus:border-[#2C2621] placeholder:text-[#2C2621]/30"
          />
        </div>

        {/* Layout principal: Carrusel + Tarjeta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Carrusel de imágenes - 2 columnas */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-[#2C2621]/5 rounded-lg overflow-hidden border-2 border-dashed border-[#2C2621]/30">
              {images.length > 0 ? (
                <>
                  <img 
                    src={images[currentImageIndex]?.preview || images[currentImageIndex]?.url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Botón eliminar imagen */}
                  <button
                    type="button"
                    onClick={() => handleImageRemove(currentImageIndex)}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>

                  {/* Navegación */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#2C2621] p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#2C2621] p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                      
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-10 bg-[#2C2621]/80 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-mono text-xs sm:text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#2C2621]/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-16 sm:h-16">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p className="mt-3 sm:mt-4 font-mono text-xs sm:text-sm uppercase tracking-wide">Sin imágenes</p>
                </div>
              )}
            </div>

            {/* Thumbnails + Botón agregar */}
            <div className="mt-2 sm:mt-4 flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index ? 'border-[#2C2621] scale-105' : 'border-[#2C2621]/30 hover:border-[#2C2621]/60'
                  }`}
                >
                  <img
                    src={image.preview || image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              
              {/* Botón agregar imagen */}
              <button
                type="button"
                onClick={handleImageAdd}
                className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-[#2C2621]/30 bg-[#2C2621]/5 hover:bg-[#2C2621]/10 hover:border-[#2C2621]/50 transition-all duration-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-8 sm:h-8 text-[#2C2621]/40">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Tarjeta de información - 1 columna */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 bg-white border-2 border-[#2C2621]/20 p-4 sm:p-6 rounded-lg shadow-lg space-y-3 sm:space-y-4">
              <div>
                <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                  Precio por noche (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xl sm:text-2xl font-bold text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                  placeholder="150.00"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                  Precio por mes (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerMonth}
                  onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                  className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xl sm:text-2xl font-bold text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                  placeholder="3000.00"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                  Tipo de alquiler
                </label>
                <select
                  value={formData.rentalType}
                  onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                  className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                >
                  <option value="DAILY">Solo por días</option>
                  <option value="MONTHLY">Solo por meses</option>
                  <option value="BOTH">Ambos (días y meses)</option>
                </select>
                <p className="mt-1 font-mono text-[10px] text-[#2C2621]/50">
                  {formData.rentalType === 'DAILY' && 'La propiedad solo se alquilará por días/noches'}
                  {formData.rentalType === 'MONTHLY' && 'La propiedad solo se alquilará por meses'}
                  {formData.rentalType === 'BOTH' && 'La propiedad se puede alquilar por días o por meses'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="font-mono text-[10px] sm:text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                    Huéspedes
                  </label>
                  <input
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                    className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                    placeholder="4"
                    min="1"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] sm:text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                    Dormitorios
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                    placeholder="2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] sm:text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                    Baños
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                    placeholder="2"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                >
                  <option value="AVAILABLE">Disponible</option>
                  <option value="RENTED">Alquilado</option>
                  <option value="MAINTENANCE">Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Características y Descripción */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Características */}
            <div className="bg-white border-2 border-[#2C2621]/20 p-4 sm:p-6 rounded-lg">
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-4 sm:mb-6 border-b-2 border-[#2C2621]/20 pb-3 sm:pb-4">
                Características
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 sm:gap-3 bg-[#F2EFE9] p-3 sm:p-4 rounded-lg border border-[#2C2621]/10">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-[#2C2621] rounded-full flex-shrink-0"></div>
                      <span className="font-mono text-xs sm:text-sm text-[#2C2621] uppercase tracking-wide truncate">
                        {amenity}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                  placeholder="Agregar característica..."
                  className="flex-1 p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#2C2621] text-white font-mono text-xs sm:text-sm uppercase tracking-wide rounded-lg hover:bg-[#3B332B] transition-all duration-300"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white border-2 border-[#2C2621]/20 p-4 sm:p-6 rounded-lg">
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-4 sm:mb-6 border-b-2 border-[#2C2621]/20 pb-3 sm:pb-4">
                Descripción
              </h2>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                placeholder="Describe la propiedad, sus características principales, ubicación, etc."
                className="w-full p-3 sm:p-4 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] leading-relaxed focus:outline-none focus:border-[#2C2621] resize-none"
              />
            </div>
          </div>

          {/* Ubicación en mapa */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-[#2C2621]/20 p-4 sm:p-6 rounded-lg">
              <h3 className="font-sans text-lg sm:text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-4 sm:mb-6">
                Ubicación en Mapa
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                    URL del Mapa
                  </label>
                  <input
                    type="text"
                    value={formData.mapUrl}
                    onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                    Número de WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+51 987 654 321"
                    className="w-full p-2 sm:p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-xs sm:text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de guardar flotante */}
        <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border-2 border-[#2C2621] px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-white text-[#2C2621] hover:bg-[#2C2621] hover:text-white shadow-2xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full border-2 border-[#3B332B] px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-[#3B332B] text-white hover:bg-[#5A4D41] disabled:opacity-50 shadow-2xl"
          >
            {loading ? 'Guardando...' : '💾 Guardar'}
          </button>
        </div>
      </div>
    </form>
  )
}