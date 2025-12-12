'use client'

import { useState, useEffect } from 'react'

interface HeroImage {
  id: string
  url: string
  alt: string | null
  displayOrder: number
  isActive: boolean
}

export default function AdminCarousel() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newAlt, setNewAlt] = useState('')

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      const res = await fetch('/api/admin/carousel')
      const data = await res.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addImage(e: React.FormEvent) {
    e.preventDefault()
    if (!newUrl) return

    try {
      const res = await fetch('/api/admin/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          alt: newAlt,
          displayOrder: images.length,
        }),
      })
      const image = await res.json()
      setImages([...images, image])
      setNewUrl('')
      setNewAlt('')
    } catch (error) {
      console.error('Error adding image:', error)
    }
  }

  async function deleteImage(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      await fetch(`/api/admin/carousel?id=${id}`, { method: 'DELETE' })
      setImages(images.filter(img => img.id !== id))
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  if (loading) {
    return <p className="font-mono text-[#2C2621]">Cargando...</p>
  }

  return (
    <div>
      <h1 className="font-sans text-3xl font-bold text-[#2C2621] uppercase tracking-tight mb-8">
        Carrusel del Hero
      </h1>

      {/* Add New Image Form */}
      <form onSubmit={addImage} className="bg-white p-6 rounded-lg border border-[#2C2621]/20 mb-8">
        <h2 className="font-sans text-xl font-bold text-[#2C2621] uppercase mb-4">
          Agregar Nueva Imagen
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">URL de la imagen</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full mt-2 p-3 bg-transparent border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
            />
          </div>
          <div className="flex-1">
            <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Texto alternativo (opcional)</label>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="Descripción de la imagen"
              className="w-full mt-2 p-3 bg-transparent border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-full px-8 py-3 bg-[#3B332B] text-white font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-[#5A4D41]"
            >
              Agregar
            </button>
          </div>
        </div>
      </form>

      {/* Images Grid */}
      {images.length === 0 ? (
        <p className="font-mono text-[#2C2621]/70">No hay imágenes en el carrusel</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={image.id} className="bg-white rounded-lg border border-[#2C2621]/20 overflow-hidden">
              <img
                src={image.url}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="font-mono text-xs text-[#2C2621]/70 mb-2 truncate">{image.url}</p>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#2C2621] uppercase">
                    Orden: {image.displayOrder + 1}
                  </span>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="font-mono text-sm text-red-600 underline hover:opacity-70"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}