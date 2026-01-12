'use client'

import { useState } from 'react'
import { submitSecurityLead } from '@/app/actions'

interface SecurityContactFormProps {
  propertyId: string
  propertyTitle: string
}

export default function SecurityContactForm({ propertyId, propertyTitle }: SecurityContactFormProps) {
  const [showWarning, setShowWarning] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await submitSecurityLead(propertyId, propertyTitle, {
        name: formData.name,
        dni: formData.dni,
        phone: formData.phone,
        email: formData.email || undefined,
        message: formData.message || undefined
      })

      if (result.success) {
        setSuccess(true)
        setFormData({ name: '', dni: '', phone: '', email: '', message: '' })
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

  const handleProceed = () => {
    setShowWarning(false)
  }

  if (success) {
    return (
      <div className="bg-white border-2 border-green-600 p-6 sm:p-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 className="font-sans text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-3">
            ¡Solicitud Enviada!
          </h3>
          <p className="font-mono text-sm text-[#2C2621]/80 leading-relaxed mb-6">
            Hemos recibido tu solicitud. Nuestro equipo verificará tu información y se pondrá en contacto contigo a través de WhatsApp en las próximas 24 horas.
          </p>
          <div className="bg-[#F2EFE9] border-l-4 border-[#2C2621] p-4">
            <p className="font-mono text-xs text-[#2C2621]/70 leading-relaxed">
              <strong className="text-[#2C2621]">Importante:</strong> Verifica que tu número de WhatsApp esté activo. Te contactaremos desde un número oficial.
            </p>
          </div>
          <button
            onClick={() => {
              setSuccess(false)
              setShowWarning(true)
            }}
            className="mt-6 font-mono text-xs text-[#2C2621]/70 hover:text-[#2C2621] underline transition-colors duration-300"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    )
  }

  if (showWarning) {
    return (
      <div className="bg-white border-2 border-[#2C2621]/20 p-6 sm:p-8">
        {/* Header con ícono de seguridad */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-[#2C2621]/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2C2621" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#2C2621] uppercase tracking-tight">
            Aviso de Seguridad
          </h3>
        </div>

        {/* Mensaje de seguridad */}
        <div className="space-y-4 mb-6">
          <div className="bg-[#F2EFE9] border-l-4 border-[#2C2621] p-4">
            <p className="font-mono text-xs sm:text-sm text-[#2C2621] leading-relaxed mb-3">
              <strong className="block text-base mb-2">🔒 ¿Por qué solicitamos tu información?</strong>
              Para proteger a ambas partes de fraudes y extorsiones, <strong>NO exponemos contactos directos</strong>. En su lugar:
            </p>
            <ul className="font-mono text-xs sm:text-sm text-[#2C2621]/80 space-y-2 ml-4">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Verificamos tu identidad con tu DNI</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Nuestro equipo revisa cada solicitud manualmente</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span><strong>Nosotros te contactaremos</strong> por WhatsApp en 24 horas</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Tu información está protegida y no será compartida</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
            <p className="font-mono text-xs sm:text-sm text-yellow-900 leading-relaxed">
              <strong className="block mb-2">⚠️ Ten en cuenta:</strong>
              Al continuar, aceptas que revisemos tu información antes de establecer contacto. Solo procederemos si tu DNI y nombre coinciden.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleProceed}
            className="w-full border-2 border-[#2C2621] px-6 py-3 font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 bg-[#2C2621] text-white hover:bg-transparent hover:text-[#2C2621]"
          >
            Entiendo, Continuar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-[#2C2621]/20 p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 pb-4 border-b-2 border-[#2C2621]/20">
        <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-2">
          Formulario de Contacto
        </h3>
        <p className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide">
          Completa tus datos y nos contactaremos contigo
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="font-mono text-xs sm:text-sm text-red-700">
            ⚠️ {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre Completo */}
        <div>
          <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
            Nombre Completo <span className="text-red-600">*</span>
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
            DNI / Documento de Identidad <span className="text-red-600">*</span>
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

        {/* Celular / WhatsApp */}
        <div>
          <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
            Celular / WhatsApp <span className="text-red-600">*</span>
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

        {/* Email (Opcional) */}
        <div>
          <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
            Correo Electrónico <span className="text-[#2C2621]/40">(Opcional)</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full border-2 border-[#2C2621]/30 bg-white p-3 font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621] transition-colors duration-300 disabled:opacity-50"
            placeholder="Ej: ejemplo@correo.com"
          />
        </div>

        {/* Mensaje Opcional */}
        <div>
          <label className="block font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide mb-2">
            Mensaje adicional <span className="text-[#2C2621]/40">(Opcional)</span>
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
        <div className="bg-[#2C2621]/5 p-4 border border-[#2C2621]/20">
          <p className="font-mono text-xs text-[#2C2621]/60 uppercase mb-1">
            Propiedad de interés:
          </p>
          <p className="font-sans text-sm font-bold text-[#2C2621]">
            {propertyTitle}
          </p>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full border-2 border-[#2C2621] px-6 py-3 font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 bg-[#2C2621] text-white hover:bg-transparent hover:text-[#2C2621] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Enviar Solicitud</span>
            </>
          )}
        </button>

        <p className="font-mono text-[10px] text-[#2C2621]/50 text-center mt-4">
          Al enviar, aceptas que procesemos tu información para contactarte sobre esta propiedad.
        </p>
      </form>
    </div>
  )
}