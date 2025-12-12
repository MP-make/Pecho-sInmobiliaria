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
    description: '',
    status: 'AVAILABLE',
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
        description: data.description || '',
        status: data.status,
      })
      setImages(data.propertyImages ? data.propertyImages.map(img => ({ url: img.url, file: null, alt: img.alt_text || '' })) : [])
    } catch (error) {
      console.error('Error fetching property:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = propertyId ? `/api/admin/properties/${propertyId}` : '/api/admin/properties'

      let res: Response
      if (propertyId) {
        // For edit, use JSON
        const processedImages = await Promise.all(images.map(async (img) => {
          let file = null
          if (img.file) {
            file = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(img.file)
            })
          }
          return { url: img.url, alt: img.alt, file }
        }))
        res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            images: processedImages,
          }),
        })
      } else {
        // For new, use JSON with base64
        const processedImages = await Promise.all(images.map(async (img) => {
          let file = null
          if (img.file) {
            file = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(img.file)
            })
          }
          return { url: img.url, alt: img.alt, file }
        }))
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            images: processedImages,
          }),
        })
      }

      if (res.ok) {
        router.push('/admin/properties')
      } else {
        const error = await res.json()
        alert('Error updating property: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving property:', error)
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Título</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
        />
      </div>

      <div>
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Precio por noche</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
        />
      </div>

      <div>
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] resize-none"
        />
      </div>

      <div>
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Imágenes</label>
        {images.map((image, index) => (
          <div key={index} className="mt-2 space-y-2">
            <input
              type="url"
              value={image.url}
              onChange={(e) => handleImageChange(index, 'url', e.target.value)}
              placeholder="https://..."
              className="w-full p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
            />
            <input
              type="file"
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
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="rounded-full px-4 py-2 bg-red-500 text-white font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImage}
          className="mt-2 rounded-full px-4 py-2 bg-green-500 text-white font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-green-700"
        >
          Añadir imagen
        </button>
      </div>

      <div>
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Estado</label>
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