'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Verificar si ya está autenticado
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/verify')
      if (res.ok) {
        router.push('/admin')
      }
    } catch (error) {
      // No autenticado, continuar en login
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Credenciales inválidas')
      }
    } catch (error) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-2 border-[#2C2621]/20 p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-sans text-3xl font-bold text-[#2C2621] uppercase tracking-tight mb-2">
              Panel Admin
            </h1>
            <p className="font-mono text-sm text-[#2C2621]/60 uppercase tracking-wide">
              Inmobiliaria Pecho's
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="mp@mp.com"
                className="w-full p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 p-3 rounded-lg">
                <p className="font-mono text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-none border-2 border-[#3B332B] px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-[#3B332B] text-white hover:bg-[#5A4D41] disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-mono text-sm text-[#2C2621]/60 hover:text-[#2C2621] uppercase tracking-wide underline"
          >
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  )
}
