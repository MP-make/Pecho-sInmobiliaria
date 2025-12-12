import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

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
  const body = await request.json()

  let url = body.url || ''
  if (body.file) {
    const base64 = body.file.split(',')[1]
    const buffer = Buffer.from(base64, 'base64')
    const ext = body.file.split(';')[0].split('/')[1] || 'png'
    const filename = `image_${Date.now()}.${ext}`
    const filepath = path.join(process.cwd(), 'public', filename)
    fs.writeFileSync(filepath, buffer)
    url = `/${filename}`
  }

  if (!url) {
    return NextResponse.json({ error: 'URL or file required' }, { status: 400 })
  }

  const alt = body.alt || null
  const displayOrder = body.displayOrder || 0

  try {
    const image = await prisma.heroImage.create({
      data: {
        url,
        alt,
        displayOrder,
        isActive: true,
      },
    })
    return NextResponse.json(image)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating image' }, { status: 500 })
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