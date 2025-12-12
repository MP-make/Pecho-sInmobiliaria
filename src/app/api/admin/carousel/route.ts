import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: { displayOrder: 'asc' },
    })
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching carousel images' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const image = await prisma.heroImage.create({
      data: {
        url: body.url,
        alt: body.alt,
        displayOrder: body.displayOrder || 0,
        isActive: body.isActive ?? true,
      },
    })
    return NextResponse.json(image)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating carousel image' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    await prisma.heroImage.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting carousel image' }, { status: 500 })
  }
}