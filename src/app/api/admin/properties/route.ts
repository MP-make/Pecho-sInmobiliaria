import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching properties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const property = await prisma.property.create({
      data: {
        title: body.title,
        price: body.price,
        description: body.description,
        imageUrl: body.imageUrl,
        status: body.status || 'AVAILABLE',
      },
    })
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating property' }, { status: 500 })
  }
}