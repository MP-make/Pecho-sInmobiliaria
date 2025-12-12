import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    })
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching property' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const property = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        price: body.price,
        description: body.description,
        imageUrl: body.imageUrl,
        status: body.status,
      },
    })
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating property' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await prisma.property.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting property' }, { status: 500 })
  }
}