'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
  propertySlug: string
}

export default function QRModal({ isOpen, onClose, propertyTitle, propertySlug }: QRModalProps) {
  if (!isOpen) return null

  // URL dinámica: usa la variable de entorno o localhost por defecto
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const propertyUrl = `${baseUrl}/property/${propertySlug}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white p-8 sm:p-12 rounded-lg max-w-md w-full text-center print:shadow-none print:p-0" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar - oculto en impresión */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#2C2621]/60 hover:text-[#2C2621] transition-colors print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Contenido para imprimir */}
        <div className="flex flex-col items-center">
          {/* QR Code grande */}
          <div className="mb-6 p-4 bg-white">
            <QRCodeSVG 
              value={propertyUrl} 
              size={250}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </div>

          {/* Nombre de la propiedad */}
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-2">
            {propertyTitle}
          </h2>

          {/* URL pequeña */}
          <p className="font-mono text-xs text-[#2C2621]/60 break-all mb-6">
            {propertyUrl}
          </p>

          {/* Botones de acción - ocultos en impresión */}
          <div className="flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-[#2C2621] text-white font-mono text-sm uppercase tracking-wide rounded hover:bg-[#3B332B] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-[#2C2621] text-[#2C2621] font-mono text-sm uppercase tracking-wide rounded hover:bg-[#2C2621] hover:text-white transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
