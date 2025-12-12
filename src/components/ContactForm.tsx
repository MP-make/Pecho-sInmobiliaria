'use client'

import { useState } from 'react'

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
  rentalType?: 'DAILY' | 'MONTHLY'
  whatsappNumber?: string | null
}

export default function ContactForm({ propertyId, propertyTitle, rentalType = 'DAILY', whatsappNumber }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    message: '',
    rentalType: rentalType
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Propiedad: ${propertyTitle}\nTipo de alquiler: ${formData.rentalType === 'DAILY' ? 'Por días' : 'Por meses'}\nCheck-in: ${formData.checkIn || 'No especificado'}\nCheck-out: ${formData.checkOut || 'No especificado'}\n\nMensaje: ${formData.message}`,
          propertyId: propertyId,
          status: 'NEW'
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', phone: '', email: '', checkIn: '', checkOut: '', message: '', rentalType: rentalType })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppClick = () => {
    const phoneNum = whatsappNumber || '51907326121'
    const rentalTypeText = formData.rentalType === 'DAILY' ? 'Por días' : 'Por meses'
    const checkInText = formData.checkIn ? `\nCheck-in: ${formData.checkIn}` : ''
    const checkOutText = formData.checkOut ? `\nCheck-out: ${formData.checkOut}` : ''
    const messageText = formData.message ? `\n\nMensaje: ${formData.message}` : ''
    
    const text = `Hola, estoy interesado en:\n*${propertyTitle}*\n\nTipo de alquiler: ${rentalTypeText}${checkInText}${checkOutText}\n\nNombre: ${formData.name || 'No especificado'}\nTeléfono: ${formData.phone || 'No especificado'}\nEmail: ${formData.email || 'No especificado'}${messageText}`
    
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
          Nombre (obligatorio)
        </label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
          placeholder="Tu nombre completo"
          className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/40 transition-colors" 
        />
      </div>

      <div>
        <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
          Teléfono (obligatorio)
        </label>
        <input 
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
          placeholder="+51 999 999 999"
          className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/40 transition-colors" 
        />
      </div>
      
      <div>
        <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
          Correo electrónico (obligatorio)
        </label>
        <input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
          placeholder="ejemplo@correo.com"
          className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/40 transition-colors" 
        />
      </div>

      <div>
        <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
          Tipo de alquiler
        </label>
        <select
          value={formData.rentalType}
          onChange={(e) => setFormData({...formData, rentalType: e.target.value as 'DAILY' | 'MONTHLY'})}
          className="w-full p-2 bg-white border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] transition-colors"
        >
          <option value="DAILY">Por días</option>
          <option value="MONTHLY">Por meses</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
            Check-in (opcional)
          </label>
          <input 
            type="date"
            value={formData.checkIn}
            onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
            className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] transition-colors" 
          />
        </div>
        <div>
          <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
            Check-out (opcional)
          </label>
          <input 
            type="date"
            value={formData.checkOut}
            onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
            className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] transition-colors" 
          />
        </div>
      </div>
      
      <div>
        <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
          Mensaje (obligatorio)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={4} 
          required
          placeholder="Cuéntanos sobre tus necesidades..."
          className="w-full p-3 bg-transparent border border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/40 resize-none transition-colors"
        ></textarea>
      </div>
      
      {submitStatus === 'success' && (
        <p className="font-mono text-xs text-green-700 uppercase tracking-wide text-center">
          ¡Mensaje enviado! Te contactaremos pronto.
        </p>
      )}
      {submitStatus === 'error' && (
        <p className="font-mono text-xs text-red-700 uppercase tracking-wide text-center">
          Error al enviar. Intenta nuevamente.
        </p>
      )}

      <div className="space-y-3">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full px-8 py-3 bg-transparent border-2 border-[#2C2621] text-[#2C2621] font-mono text-sm uppercase tracking-widest hover:bg-[#2C2621] hover:text-[#F2EFE9] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
        </button>

        <button 
          type="button"
          onClick={handleWhatsAppClick}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-[#128C7E] transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar por WhatsApp
        </button>
      </div>
    </form>
  )
}