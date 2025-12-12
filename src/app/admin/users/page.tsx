'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  isActive: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({ email: '', password: '', name: '' })
        setShowForm(false)
        fetchUsers()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al crear usuario')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear usuario')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="font-mono text-[#2C2621]/60 uppercase tracking-wide">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-sans text-4xl font-bold text-[#2C2621] uppercase tracking-tight mb-2">
            Usuarios Admin
          </h1>
          <p className="font-mono text-sm text-[#2C2621]/60 uppercase tracking-wide">
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-none border-2 border-[#3B332B] px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-[#3B332B] text-white hover:bg-[#5A4D41]"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg mb-8">
          <h2 className="font-sans text-2xl font-bold text-[#2C2621] uppercase tracking-tight mb-6">
            Nuevo Usuario Admin
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={4}
                className="w-full p-3 bg-white border-2 border-[#2C2621]/20 rounded-lg font-mono text-sm text-[#2C2621] focus:outline-none focus:border-[#2C2621]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-none border-2 border-[#3B332B] px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-[#3B332B] text-white hover:bg-[#5A4D41]"
            >
              Crear Usuario
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white border-2 border-[#2C2621]/20 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-sans text-xl font-bold text-[#2C2621] uppercase tracking-tight mb-1">
                  {user.name}
                </h3>
                <p className="font-mono text-sm text-[#2C2621]/60 uppercase tracking-wide mb-2">
                  {user.email}
                </p>
                <div className="flex gap-4 items-center">
                  <span className={`font-mono text-xs uppercase tracking-wide px-3 py-1 rounded ${
                    user.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="font-mono text-xs text-[#2C2621]/60 uppercase tracking-wide">
                    Creado: {new Date(user.createdAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
