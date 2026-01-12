'use client'

import { useState } from 'react'
import { submitSecurityLead } from '@/app/actions'

interface LeadModalProps {
  propertyId: string
  propertyTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function LeadModal({ propertyId, propertyTitle, isOpen, onClose }: LeadModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    message: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await submitSecurityLead(propertyId, propertyTitle, {
        name: formData.name,
        dni: formData.dni,
        phone: formData.phone,
        message: formData.message || undefined
      })

      if (result.success && result.whatsappUrl) {
        // Redirigir a WhatsApp
        window.open(result.whatsappUrl, '_blank')
        // Cerrar el modal después de un breve delay
        setTimeout(() => {
          onClose()
          setFormData({ name: '', dni: '', phone: '', message: '' })
        }, 500)
      } else {
        setError(result.error || 'Error al procesar la solicitud')
      }
    } catch (err) {
      setError('Error inesperado. Por favor intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#F2EFE9] border-4 border-[#2C2621] max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2C2621] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[#F2EFE9] transition-colors duration-300"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h2 className="font-sans text-2xl font-bold uppercase tracking-tight">
              Verificación de seguridad
            </h2>
          </div>
          <p className="font-mono text-xs text-white/80 uppercase tracking-wide">
            Protegemos tu información y la nuestra
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-white border-l-4 border-[#2C2621] p-4 mb-6">
            <p className="font-mono text-xs text-[#2C2621]/80 leading-relaxed">
              <strong className="text-[#2C2621]">🔒 Sistema de seguridad:</strong> Para evitar contactos fraudulentos y proteger a ambas partes, necesitamos verificar tu identidad antes de brindarte el contacto directo.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="font-mono text-xs text-red-700">
                ⚠️ {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre Completo */}
            <div>
              <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
                disabled={isLoading}
                className="w-full border-2 border-[#2C2621]/30 bg-white p-3 font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621] transition-colors duration-300 disabled:opacity-50"
                placeholder="Ej: Juan Pérez García"
              />
            </div>

            {/* DNI */}
            <div>
              <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
                DNI / Documento de Identidad *
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                pattern="\d{8,12}"
                minLength={8}
                maxLength={12}
                disabled={isLoading}
                className="w-full border-2 border-[#2C2621]/30 bg-white p-3 font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621] transition-colors duration-300 disabled:opacity-50"
                placeholder="Ej: 12345678"
              />
              <p className="font-mono text-[10px] text-[#2C2621]/50 mt-1">
                Solo números, 8-12 dígitos
              </p>
            </div>

            {/* Celular */}
            <div>
              <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
                Celular / WhatsApp *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="\d{9,15}"
                minLength={9}
                disabled={isLoading}
                className="w-full border-2 border-[#2C2621]/30 bg-white p-3 font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621] transition-colors duration-300 disabled:opacity-50"
                placeholder="Ej: 987654321"
              />
              <p className="font-mono text-[10px] text-[#2C2621]/50 mt-1">
                Solo números, mínimo 9 dígitos
              </p>
            </div>

            {/* Mensaje Opcional */}
            <div>
              <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
                Mensaje adicional (opcional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
                className="w-full border-2 border-[#2C2621]/30 bg-white p-3 font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621] transition-colors duration-300 resize-none disabled:opacity-50"
                placeholder="Escribe aquí cualquier pregunta o comentario adicional..."
              />
            </div>

            {/* Info de la propiedad */}
            <div className="bg-[#2C2621]/5 p-4 rounded border border-[#2C2621]/20">
              <p className="font-mono text-xs text-[#2C2621]/60 uppercase mb-1">
                Propiedad de interés:
              </p>
              <p className="font-sans text-sm font-bold text-[#2C2621]">
                {propertyTitle}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 border-2 border-[#2C2621]/30 px-6 py-3 font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 bg-transparent text-[#2C2621] hover:bg-[#2C2621]/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 border-2 border-[#2C2621] px-6 py-3 font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 bg-[#2C2621] text-white hover:bg-transparent hover:text-[#2C2621] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Continuar a WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}