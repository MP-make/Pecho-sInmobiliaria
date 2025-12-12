import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/auth'

export async function POST() {
  try {
    const email = 'mp@mp.com'
    const password = 'mp'
    
    // Verificar si ya existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Usuario admin ya existe' })
    }

    // Crear usuario admin
    const hashedPassword = await hashPassword(password)
    const adminUser = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Administrador'
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Usuario admin creado exitosamente',
      email: adminUser.email 
    })
  } catch (error) {
    console.error('Error creando usuario admin:', error)
    return NextResponse.json({ error: 'Error al crear usuario admin' }, { status: 500 })
  }
}
