'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  price: number
  status: string
  imageUrl: string | null
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    try {
      const res = await fetch('/api/admin/properties')
      const data = await res.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteProperty(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return
    
    try {
      await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
      setProperties(properties.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  if (loading) {
    return <p className="font-mono text-[#2C2621]">Cargando...</p>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-sans text-3xl font-bold text-[#2C2621] uppercase tracking-tight">
          Propiedades
        </h1>
        <Link 
          href="/admin/properties/new"
          className="rounded-full px-8 py-3 bg-[#3B332B] text-white font-sans font-bold uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-[#5A4D41]"
        >
          + Nueva Propiedad
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="font-mono text-[#2C2621]/70">No hay propiedades registradas</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#2C2621]/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#3B332B] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">Imagen</th>
                <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">Título</th>
                <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">Precio</th>
                <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">Estado</th>
                <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-[#2C2621]/10">
                  <td className="px-6 py-4">
                    <img 
                      src={property.imageUrl || 'https://via.placeholder.com/100'} 
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-sans font-bold text-[#2C2621]">{property.title}</td>
                  <td className="px-6 py-4 font-mono text-[#2C2621]">${property.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-xs uppercase px-3 py-1 rounded-full ${
                      property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/properties/${property.id}`}
                        className="font-mono text-sm text-[#3B332B] underline hover:opacity-70"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => deleteProperty(property.id)}
                        className="font-mono text-sm text-red-600 underline hover:opacity-70"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}