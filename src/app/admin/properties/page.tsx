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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#2C2621] uppercase tracking-tight">
          Propiedades
        </h1>
        <Link 
          href="/admin/properties/new"
          className="rounded-full px-6 sm:px-8 py-2 sm:py-3 bg-[#3B332B] text-white font-sans font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors duration-300 hover:bg-[#5A4D41] whitespace-nowrap"
        >
          + Nueva Propiedad
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="font-mono text-sm sm:text-base text-[#2C2621]/70">No hay propiedades registradas</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#2C2621]/20 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#3B332B] text-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-mono text-[10px] sm:text-xs uppercase tracking-wide">Imagen</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-mono text-[10px] sm:text-xs uppercase tracking-wide">Título</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-mono text-[10px] sm:text-xs uppercase tracking-wide">Precio</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-mono text-[10px] sm:text-xs uppercase tracking-wide">Estado</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-mono text-[10px] sm:text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-[#2C2621]/10">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <img 
                      src={property.imageUrl || 'https://via.placeholder.com/100'} 
                      alt={property.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-sans text-sm sm:text-base font-bold text-[#2C2621]">{property.title}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm text-[#2C2621]">${property.price.toLocaleString()}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`font-mono text-[10px] sm:text-xs uppercase px-2 sm:px-3 py-1 rounded-full ${
                      property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link 
                        href={`/admin/properties/${property.id}`}
                        className="font-mono text-xs sm:text-sm text-[#3B332B] underline hover:opacity-70"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => deleteProperty(property.id)}
                        className="font-mono text-xs sm:text-sm text-red-600 underline hover:opacity-70"
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