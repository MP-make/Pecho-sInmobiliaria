import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return await verifyToken(token)
}

// GET: Listar todos los leads/mensajes
export async function GET() {
  try {
    const auth = await checkAuth()
    if (!auth) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const leads = await prisma.lead.findMany({
      include: {
        property: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error al obtener leads:', error)
    return NextResponse.json({ error: 'Error al obtener leads' }, { status: 500 })
  }
}

// POST: Crear un nuevo lead (público - sin autenticación)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, propertyId, dni } = body

    // Validaciones básicas - propertyId es opcional para mensajes generales
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      )
    }

    // Si hay propertyId, verificar que la propiedad existe
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId }
      })

      if (!property) {
        return NextResponse.json(
          { error: 'Propiedad no encontrada' },
          { status: 404 }
        )
      }
    }

    // Crear el lead
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        propertyId: propertyId || null,
        dni: dni || null
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error al crear lead:', error)
    return NextResponse.json({ error: 'Error al crear lead' }, { status: 500 })
  }
}

// DELETE: Eliminar un lead
export async function DELETE(request: Request) {
  try {
    const auth = await checkAuth()
    if (!auth) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar lead:', error)
    return NextResponse.json({ error: 'Error al eliminar lead' }, { status: 500 })
  }
}
