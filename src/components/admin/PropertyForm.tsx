'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PropertyFormProps {
  propertyId?: string
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    imageUrl: '',
    status: 'AVAILABLE',
  })

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
        imageUrl: data.imageUrl || '',
        status: data.status,
      })
    } catch (error) {
      console.error('Error fetching property:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = propertyId ? `/api/admin/properties/${propertyId}` : '/api/admin/properties'
      const method = propertyId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      })

      if (res.ok) {
        router.push('/admin/properties')
      }
    } catch (error) {
      console.error('Error saving property:', error)
    } finally {
      setLoading(false)
    }
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
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">URL de imagen principal</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://..."
          className="w-full mt-2 p-3 bg-white border border-[#2C2621]/20 rounded-lg focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621]"
        />
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