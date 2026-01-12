'use client'

import { useState, useEffect, useRef } from 'react'

interface HeaderProps {
  language: string
  onLanguageChange: (lang: string) => void
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

  const translations = {
    es: {
      home: 'Inicio',
      properties: 'Propiedades',
      contact: 'Contacto',
      brand: "Alquileres Pisco",
      spanish: 'Español',
      english: 'English'
    },
    en: {
      home: 'Home',
      properties: 'Properties',
      contact: 'Contact',
      brand: "Alquileres Pisco",
      spanish: 'Español',
      english: 'English'
    }
  }

  const t = translations[language as keyof typeof translations]

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (lang: string) => {
    console.log('Cambiando idioma a:', lang) // Debug
    onLanguageChange(lang)
    setIsLanguageDropdownOpen(false)
  }

  return (
    <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 py-4 sm:py-6">
      <span className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-[#2C2621] uppercase tracking-widest">
        {t.brand}
      </span>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="#inicio" className="font-mono text-sm text-[#2C2621] hover:opacity-70 transition-opacity duration-300 underline underline-offset-4">
          {t.home}
        </a>
        <a href="#propiedades" className="font-mono text-sm text-[#2C2621] hover:opacity-70 transition-opacity duration-300 underline underline-offset-4">
          {t.properties}
        </a>
        <a href="#contacto" className="rounded-none border-2 border-[#3B332B] px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#3B332B] hover:bg-[#3B332B] hover:text-white">
          {t.contact}
        </a>
        
        {/* Language Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
            }}
            className="flex items-center gap-2 px-3 py-2 bg-transparent font-mono text-sm font-bold uppercase tracking-wide text-[#2C2621] hover:bg-[#2C2621]/5 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2C2621]">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
            </svg>
            <span className="text-xs">{language === 'es' ? 'ES' : 'EN'}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isLanguageDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white border-2 border-[#2C2621]/20 shadow-2xl overflow-hidden z-50">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLanguageChange('es')
                }}
                className={`w-full px-4 py-3 text-left font-mono text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-3 ${
                  language === 'es' 
                    ? 'bg-[#2C2621] text-[#F2EFE9] font-bold' 
                    : 'text-[#2C2621] hover:bg-[#F2EFE9]'
                }`}
              >
                <span className="text-lg">🇪🇸</span>
                {t.spanish}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLanguageChange('en')
                }}
                className={`w-full px-4 py-3 text-left font-mono text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-3 ${
                  language === 'en' 
                    ? 'bg-[#2C2621] text-[#F2EFE9] font-bold' 
                    : 'text-[#2C2621] hover:bg-[#F2EFE9]'
                }`}
              >
                <span className="text-lg">🇺🇸</span>
                {t.english}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden flex items-center gap-3">
        {/* Language Selector Mobile */}
        <div className="relative" ref={mobileDropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
            }}
            className="flex items-center gap-1 px-2 py-1 bg-transparent font-mono text-xs font-bold uppercase tracking-wide text-[#2C2621]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
            </svg>
            <span className="text-[10px]">{language === 'es' ? 'ES' : 'EN'}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="10" 
              height="10" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Dropdown Menu Mobile */}
          {isLanguageDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white border-2 border-[#2C2621]/20 shadow-2xl overflow-hidden z-50">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLanguageChange('es')
                }}
                className={`w-full px-3 py-2 text-left font-mono text-xs uppercase tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  language === 'es' 
                    ? 'bg-[#2C2621] text-[#F2EFE9] font-bold' 
                    : 'text-[#2C2621] hover:bg-[#F2EFE9]'
                }`}
              >
                <span>🇪🇸</span>
                Español
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleLanguageChange('en')
                }}
                className={`w-full px-3 py-2 text-left font-mono text-xs uppercase tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  language === 'en' 
                    ? 'bg-[#2C2621] text-[#F2EFE9] font-bold' 
                    : 'text-[#2C2621] hover:bg-[#F2EFE9]'
                }`}
              >
                <span>🇺🇸</span>
                English
              </button>
            </div>
          )}
        </div>
        
        <a 
          href="#contacto" 
          className="rounded-none border-2 border-[#3B332B] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-transparent text-[#3B332B] hover:bg-[#3B332B] hover:text-white"
        >
          {t.contact}
        </a>
      </div>
    </header>
  )
}