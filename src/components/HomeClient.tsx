'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import PropertyCard from '@/components/PropertyCard'
import HeroCarousel from '@/components/HeroCarousel'

interface HomeClientProps {
  properties: any[]
  heroImages: string[]
}

export default function HomeClient({ properties, heroImages }: HomeClientProps) {
  const [language, setLanguage] = useState('es')

  // Cargar idioma del localStorage al montar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es'
    setLanguage(savedLanguage)
  }, [])

  // Guardar idioma en localStorage cuando cambie
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const translations = {
    es: {
      heroTitle1: 'Alquiler de Casas en',
      heroTitle2: 'Pisco - Perú',
      noProperties: 'No hay propiedades disponibles',
      contactTitle: 'Contáctanos',
      contactSubtitle: 'Separa tu cita para alguna visita a la casa en elección',
      nameLabel: 'Nombre (obligatorio)',
      lastNamePlaceholder: 'Apellido',
      emailLabel: 'Correo electrónico (obligatorio)',
      messageLabel: 'Mensaje (obligatorio)',
      submitButton: 'Enviar'
    },
    en: {
      heroTitle1: 'House Rentals in',
      heroTitle2: 'Pisco - Peru',
      noProperties: 'No properties available',
      contactTitle: 'Contact Us',
      contactSubtitle: 'Schedule an appointment to visit the house of your choice',
      nameLabel: 'Name (required)',
      lastNamePlaceholder: 'Last Name',
      emailLabel: 'Email (required)',
      messageLabel: 'Message (required)',
      submitButton: 'Send'
    }
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Header */}
      <Header language={language} onLanguageChange={handleLanguageChange} />

      {/* Hero Section con Carrusel */}
      <section id="inicio" className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mx-4 sm:mx-8 md:mx-16">
        <HeroCarousel images={heroImages} interval={5000} />
        <div className="absolute inset-0 bg-black/20 z-[1]"></div>
        <h1 className="font-sans text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight text-center z-10 leading-tight px-4">
          {t.heroTitle1}<br />{t.heroTitle2}
        </h1>
      </section>

      {/* Properties Grid */}
      <section id="propiedades" className="py-8 sm:py-12 md:py-16">
        <div className="space-y-0">
          {properties.length > 0 ? (
            properties.map((p: any, index: number) => (
              <PropertyCard key={p.id} property={p} reverse={index % 2 === 1} language={language} />
            ))
          ) : (
            <p className="font-mono text-center text-[#2C2621] uppercase tracking-wide py-16">
              {t.noProperties}
            </p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="px-4 sm:px-8 md:px-16 py-8 sm:py-12 md:py-16 bg-[#E8E2D9]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/2">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2621] uppercase tracking-tight mb-4">
              {t.contactTitle}
            </h2>
            <p className="font-mono text-sm text-[#2C2621] tracking-wide">
              {t.contactSubtitle}
            </p>
          </div>
          <div className="md:w-1/2 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">{t.nameLabel}</label>
                <input type="text" placeholder={t.nameLabel.split(' (')[0]} className="w-full mt-2 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/50" />
              </div>
              <div className="flex-1">
                <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">&nbsp;</label>
                <input type="text" placeholder={t.lastNamePlaceholder} className="w-full mt-2 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621] placeholder:text-[#2C2621]/50" />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">{t.emailLabel}</label>
              <input type="email" className="w-full mt-2 p-3 bg-transparent border-b border-[#2C2621] focus:outline-none font-mono text-sm text-[#2C2621]" />
            </div>
            <div>
              <label className="font-mono text-xs text-[#2C2621] uppercase tracking-wide">{t.messageLabel}</label>
              <textarea rows={3} className="w-full mt-2 p-3 bg-transparent border border-[#2C2621] rounded-lg focus:outline-none font-mono text-sm text-[#2C2621] resize-none"></textarea>
            </div>
            <button className="rounded-none border-2 border-[#3B332B] px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#3B332B] hover:bg-[#3B332B] hover:text-white">
              {t.submitButton}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}