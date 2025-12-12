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
