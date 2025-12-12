'use client'

import { useState, useTransition } from 'react'
import { createLead } from '@/app/actions'

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')
    startTransition(async () => {
      try {
        await createLead(new FormData(e.currentTarget), propertyId)
        setMessage('¡Mensaje enviado!')
        e.currentTarget.reset()
      } catch (error) {
        setMessage('Error al enviar mensaje. Verifica los datos.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
            Nombre (obligatorio)
          </label>
          <input 
            type="text" 
            name="name" 
            required 
            placeholder="Nombre"
            className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/40 transition-colors" 
          />
        </div>
        <div>
          <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
            Teléfono
          </label>
          <input 
            type="tel" 
            name="phone" 
            placeholder="Teléfono"
            className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/40 transition-colors" 
          />
        </div>
      </div>
      
      <div>
        <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
          Correo electrónico (obligatorio)
        </label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] transition-colors" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
            Check-in
          </label>
          <input 
            type="date" 
            name="checkIn" 
            className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] transition-colors" 
          />
        </div>
        <div>
          <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
            Check-out
          </label>
          <input 
            type="date" 
            name="checkOut" 
            className="w-full p-2 bg-transparent border-b border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] transition-colors" 
          />
        </div>
      </div>
      
      <div>
        <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
          Mensaje (obligatorio)
        </label>
        <textarea 
          name="message" 
          rows={4} 
          required
          className="w-full p-3 bg-transparent border border-[#2C2621]/30 focus:outline-none focus:border-[#2C2621] font-mono text-sm text-[#2C2621] resize-none transition-colors"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        disabled={isPending} 
        className="w-full px-8 py-3 bg-transparent border-2 border-[#2C2621] text-[#2C2621] font-mono text-sm uppercase tracking-widest hover:bg-[#2C2621] hover:text-[#F2EFE9] transition-all duration-300 disabled:opacity-50"
      >
        {isPending ? 'Enviando...' : 'Enviar'}
      </button>
      
      {message && (
        <p className={`font-mono text-sm text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}