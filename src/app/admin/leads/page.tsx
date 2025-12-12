'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  checkIn?: string
  checkOut?: string
  createdAt: string
  property: {
    id: string
    title: string
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/leads')
      const data = await res.json()
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este mensaje?')) return

    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id))
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="font-mono text-[#2C2621]/60 uppercase tracking-wide">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C2621] uppercase tracking-tight mb-2">
          Mensajes de Contacto
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#2C2621]/60 uppercase tracking-wide">
          {leads.length} mensaje{leads.length !== 1 ? 's' : ''} recibido{leads.length !== 1 ? 's' : ''}
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white border-2 border-[#2C2621]/20 p-8 sm:p-12 rounded-lg text-center">
          <p className="font-mono text-sm sm:text-base text-[#2C2621]/60 uppercase tracking-wide">
            No hay mensajes aún
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white border-2 border-[#2C2621]/20 p-4 sm:p-6 rounded-lg">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1 pr-2">
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-1">
                    {lead.name}
                  </h3>
                  <p className="font-mono text-xs sm:text-sm text-[#2C2621]/60 uppercase tracking-wide break-words">
                    Propiedad: {lead.property.title}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                    Email
                  </label>
                  <a href={`mailto:${lead.email}`} className="font-mono text-xs sm:text-sm text-[#2C2621] hover:underline break-all">
                    {lead.email}
                  </a>
                </div>
                {lead.phone && (
                  <div>
                    <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                      Teléfono
                    </label>
                    <a href={`tel:${lead.phone}`} className="font-mono text-xs sm:text-sm text-[#2C2621] hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                )}
              </div>

              {(lead.checkIn || lead.checkOut) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {lead.checkIn && (
                    <div>
                      <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                        Check-in
                      </label>
                      <p className="font-mono text-xs sm:text-sm text-[#2C2621]">
                        {new Date(lead.checkIn).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                  )}
                  {lead.checkOut && (
                    <div>
                      <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                        Check-out
                      </label>
                      <p className="font-mono text-xs sm:text-sm text-[#2C2621]">
                        {new Date(lead.checkOut).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {lead.message && (
                <div className="mb-3 sm:mb-4">
                  <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-1">
                    Mensaje
                  </label>
                  <p className="font-mono text-xs sm:text-sm text-[#2C2621] bg-[#F2EFE9] p-3 rounded break-words">
                    {lead.message}
                  </p>
                </div>
              )}

              <div className="text-right">
                <span className="font-mono text-[10px] sm:text-xs text-[#2C2621]/60 uppercase tracking-wide">
                  {new Date(lead.createdAt).toLocaleString('es-PE')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
