'use client'

import { useState, useEffect } from 'react'
import { getAllLeads, toggleBlockDNI } from '@/app/actions'

interface Lead {
  id: string
  name: string
  dni: string
  phone: string | null
  email: string
  message: string | null
  status: string
  createdAt: Date
  property: {
    title: string
    slug: string
  } | null
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'PENDIENTE' | 'BLOQUEADO'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    const result = await getAllLeads()
    if (result.success && result.leads) {
      setLeads(result.leads as Lead[])
    }
    setLoading(false)
  }

  const handleBlockToggle = async (leadId: string, currentStatus: string) => {
    const shouldBlock = currentStatus !== 'BLOQUEADO'
    const result = await toggleBlockDNI(leadId, shouldBlock)
    if (result.success) {
      loadLeads()
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.dni.includes(searchTerm) ||
      (lead.phone && lead.phone.includes(searchTerm))
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: leads.length,
    pendientes: leads.filter(l => l.status === 'PENDIENTE').length,
    bloqueados: leads.filter(l => l.status === 'BLOQUEADO').length,
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const openWhatsApp = (phone: string, name: string, propertyTitle: string) => {
    const message = encodeURIComponent(
      `Hola ${name}, te contacto desde Pecho's Inmobiliaria sobre tu interés en: ${propertyTitle}`
    )
    window.open(`https://wa.me/51${phone}?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EFE9] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#2C2621] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-mono text-sm text-[#2C2621]">Cargando leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[#2C2621] uppercase tracking-tight mb-2">
            Gestión de Leads
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#2C2621]/60 uppercase tracking-wide">
            Sistema de verificación de identidad y contactos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border-2 border-[#2C2621]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-[#2C2621]/60 uppercase mb-1">Total Leads</p>
                <p className="font-mono text-3xl font-bold text-[#2C2621]">{stats.total}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2C2621" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>

          <div className="bg-white border-2 border-yellow-500/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-[#2C2621]/60 uppercase mb-1">Pendientes</p>
                <p className="font-mono text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>

          <div className="bg-white border-2 border-red-500/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-[#2C2621]/60 uppercase mb-1">Bloqueados</p>
                <p className="font-mono text-3xl font-bold text-red-600">{stats.bloqueados}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border-2 border-[#2C2621]/20 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, DNI o teléfono..."
                className="w-full border-2 border-[#2C2621]/30 bg-white p-3 font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621] transition-colors duration-300"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
                Filtrar por Estado
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-3 font-mono text-xs uppercase tracking-wide transition-all duration-300 ${
                    filter === 'all'
                      ? 'bg-[#2C2621] text-white border-2 border-[#2C2621]'
                      : 'bg-white text-[#2C2621] border-2 border-[#2C2621]/30 hover:border-[#2C2621]'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter('PENDIENTE')}
                  className={`px-4 py-3 font-mono text-xs uppercase tracking-wide transition-all duration-300 ${
                    filter === 'PENDIENTE'
                      ? 'bg-yellow-600 text-white border-2 border-yellow-600'
                      : 'bg-white text-yellow-600 border-2 border-yellow-600/30 hover:border-yellow-600'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFilter('BLOQUEADO')}
                  className={`px-4 py-3 font-mono text-xs uppercase tracking-wide transition-all duration-300 ${
                    filter === 'BLOQUEADO'
                      ? 'bg-red-600 text-white border-2 border-red-600'
                      : 'bg-white text-red-600 border-2 border-red-600/30 hover:border-red-600'
                  }`}
                >
                  Bloqueados
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white border-2 border-[#2C2621]/20">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2C2621] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide">Fecha</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide">Nombre</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide">DNI</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide">Teléfono</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide">Propiedad</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 text-center font-mono text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr key={lead.id} className={`border-t border-[#2C2621]/10 ${index % 2 === 0 ? 'bg-[#F2EFE9]/30' : 'bg-white'}`}>
                    <td className="px-4 py-4 font-mono text-xs text-[#2C2621]">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm text-[#2C2621] font-bold">
                      {lead.name}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm text-[#2C2621]">
                      {lead.dni}
                    </td>
                    <td className="px-4 py-4 font-mono text-sm text-[#2C2621]">
                      {lead.phone || 'N/A'}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-[#2C2621]">
                      {lead.property?.title || 'Sin propiedad'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-3 py-1 font-mono text-xs uppercase tracking-wide ${
                        lead.status === 'BLOQUEADO'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {lead.phone && (
                          <button
                            onClick={() => openWhatsApp(lead.phone!, lead.name, lead.property?.title || 'propiedad')}
                            className="p-2 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors duration-300"
                            title="Contactar por WhatsApp"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleBlockToggle(lead.id, lead.status)}
                          className={`p-2 transition-colors duration-300 ${
                            lead.status === 'BLOQUEADO'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                          title={lead.status === 'BLOQUEADO' ? 'Desbloquear' : 'Bloquear'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {lead.status === 'BLOQUEADO' ? (
                              <path d="M7 11h10M7 15h10M12 7v10"/>
                            ) : (
                              <>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-[#F2EFE9]/50 border-2 border-[#2C2621]/20 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#2C2621] mb-1">{lead.name}</p>
                    <p className="font-mono text-xs text-[#2C2621]/60">{formatDate(lead.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 font-mono text-xs uppercase tracking-wide ${
                    lead.status === 'BLOQUEADO'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <p className="font-mono text-xs text-[#2C2621]"><strong>DNI:</strong> {lead.dni}</p>
                  <p className="font-mono text-xs text-[#2C2621]"><strong>Teléfono:</strong> {lead.phone || 'N/A'}</p>
                  <p className="font-mono text-xs text-[#2C2621]"><strong>Propiedad:</strong> {lead.property?.title || 'Sin propiedad'}</p>
                </div>

                <div className="flex gap-2">
                  {lead.phone && (
                    <button
                      onClick={() => openWhatsApp(lead.phone!, lead.name, lead.property?.title || 'propiedad')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="font-mono text-xs uppercase">WhatsApp</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleBlockToggle(lead.id, lead.status)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 transition-colors duration-300 ${
                      lead.status === 'BLOQUEADO'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {lead.status === 'BLOQUEADO' ? (
                        <path d="M7 11h10M7 15h10M12 7v10"/>
                      ) : (
                        <>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </>
                      )}
                    </svg>
                    <span className="font-mono text-xs uppercase">
                      {lead.status === 'BLOQUEADO' ? 'Desbloquear' : 'Bloquear'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2C2621" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-30">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="font-mono text-sm text-[#2C2621]/60">No se encontraron leads</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
