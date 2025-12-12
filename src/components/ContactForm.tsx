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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Nombre (obligatorio)</label>
          <input 
            type="text" 
            name="name" 
            required 
            placeholder="Nombre"
            className="w-full mt-1 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/50" 
          />
        </div>
        <div className="flex-1">
          <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Teléfono</label>
          <input 
            type="tel" 
            name="phone" 
            placeholder="Teléfono"
            className="w-full mt-1 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/50" 
          />
        </div>
      </div>
      
      <div>
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Correo electrónico (obligatorio)</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full mt-1 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621]" 
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Check-in</label>
          <input 
            type="date" 
            name="checkIn" 
            className="w-full mt-1 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621]" 
          />
        </div>
        <div className="flex-1">
          <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Check-out</label>
          <input 
            type="date" 
            name="checkOut" 
            className="w-full mt-1 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621]" 
          />
        </div>
      </div>
      
      <div>
        <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">Mensaje (obligatorio)</label>
        <textarea 
          name="message" 
          rows={3} 
          className="w-full mt-1 p-3 bg-transparent border border-[#2C2621] rounded-lg focus:outline-none font-mono text-sm text-[#2C2621] resize-none"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        disabled={isPending} 
        className="px-8 py-3 bg-transparent border border-[#2C2621] text-[#2C2621] font-mono text-sm uppercase tracking-wide hover:bg-[#2C2621] hover:text-[#F2EFE9] transition disabled:opacity-50"
      >
        {isPending ? 'Enviando...' : 'Enviar'}
      </button>
      
      {message && (
        <p className={`font-mono text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}