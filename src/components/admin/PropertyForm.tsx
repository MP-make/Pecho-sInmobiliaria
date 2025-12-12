'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PropertyFormProps {
  propertyId?: string
}

interface ImageData {
  url: string
  file: File | null
  alt: string
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    mapLat: '',
    mapLng: '',
  })
  const [images, setImages] = useState<ImageData[]>([])

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
        mapLat: data.mapLat?.toString() || '',
        mapLng: data.mapLng?.toString() || '',
      })
      setImages(data.propertyImages ? data.propertyImages.map((img: any) => ({ url: img.url, file: null, alt: img.alt_text || '' })) : [])
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
        return { url: img.url, alt: img.alt, file }
      }))

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        pricePerMonth: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : null,
        maxGuests: formData.maxGuests ? parseInt(formData.maxGuests) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        mapLat: formData.mapLat ? parseFloat(formData.mapLat) : null,
        mapLng: formData.mapLng ? parseFloat(formData.mapLng) : null,
        images: processedImages,
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

  function handleImageChange(index: number, key: keyof ImageData, value: string | File | null) {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], [key]: value }
    setImages(newImages)
  }

  function handleAddImage() {
    setImages([...images, { url: '', file: null, alt: '' }])
  }

  function handleRemoveImage(index: number) {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {/* Información Básica */}
      <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg">
        <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">Información Básica</h2>
        
        <div className="space-y-4">
          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="Ej: Casa familiar en el centro de Pisco"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] resize-none"
              placeholder="Describe la propiedad, sus características principales, ubicación, etc."
            />
          </div>

          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Dirección</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="Ej: Av. San Martín 123, Pisco"
            />
          </div>
        </div>
      </div>

      {/* Precios */}
      <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg">
        <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">Precios</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Precio por noche (S/) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="150.00"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Precio por mes (S/)</label>
            <input
              type="number"
              step="0.01"
              value={formData.pricePerMonth}
              onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="3000.00"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Tipo de alquiler</label>
          <select
            value={formData.rentalType}
            onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
            className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
          >
            <option value="DAILY">Por días (corto plazo/vacacional)</option>
            <option value="MONTHLY">Por meses (temporada/medio plazo)</option>
          </select>
          <p className="mt-2 font-mono text-xs text-[#2C2621]/60">
            Si seleccionas "Por días", usa el precio por noche. Si es "Por meses", completa ambos campos.
          </p>
        </div>
      </div>

      {/* Capacidad y Habitaciones */}
      <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg">
        <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">Capacidad y Habitaciones</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Huéspedes máximo</label>
            <input
              type="number"
              value={formData.maxGuests}
              onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="4"
              min="1"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Dormitorios</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="2"
              min="1"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Baños</label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="2"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Ubicación en mapa */}
      <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg">
        <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">Ubicación en Mapa</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Latitud</label>
            <input
              type="number"
              step="any"
              value={formData.mapLat}
              onChange={(e) => setFormData({ ...formData, mapLat: e.target.value })}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="-13.7098"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Longitud</label>
            <input
              type="number"
              step="any"
              value={formData.mapLng}
              onChange={(e) => setFormData({ ...formData, mapLng: e.target.value })}
              className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              placeholder="-76.2067"
            />
          </div>
        </div>
        
        <p className="mt-2 font-mono text-xs text-[#2C2621]/60">
          Puedes obtener las coordenadas desde{' '}
          <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2C2621]">
            Google Maps
          </a>
          {' '}haciendo clic derecho en el mapa.
        </p>
      </div>

      {/* Imágenes */}
      <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg">
        <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">Imágenes</h2>
        
        {images.map((image, index) => (
          <div key={index} className="mb-4 p-4 border border-[#2C2621]/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#2C2621] uppercase">Imagen {index + 1} {index === 0 && '(Portada)'}</span>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="rounded-full px-4 py-2 bg-red-500 text-white font-sans font-bold uppercase tracking-widest text-xs transition-colors duration-300 hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
            
            <div className="space-y-2">
              <input
                type="url"
                value={image.url}
                onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                placeholder="https://..."
                className="w-full p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, 'file', e.target.files ? e.target.files[0] : null)}
                className="w-full p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              />
              <input
                type="text"
                value={image.alt}
                onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                placeholder="Descripción de la imagen"
                className="w-full p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
              />
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddImage}
          className="mt-2 rounded-full px-6 py-3 bg-green-600 text-white font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-green-700"
        >
          + Añadir imagen
        </button>
      </div>

      {/* Estado */}
      <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg">
        <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">Estado</h2>
        
        <div>
          <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Estado de la propiedad</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="RENTED">Alquilado</option>
            <option value="MAINTENANCE">Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full px-8 py-3 bg-[#3B332B] text-white font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-[#5A4D41] disabled:opacity-50"
        >
          {loading ? 'Guardando...' : propertyId ? 'Actualizar' : 'Crear'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-8 py-3 bg-transparent border border-[#2C2621] text-[#2C2621] font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-[#2C2621] hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}