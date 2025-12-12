import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { propertyImages: true },
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
        status: body.status,
      },
    })

    // Handle images
    if (body.images) {
      // Delete old images
      await prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      })

      let firstImageUrl = ''
      for (let i = 0; i < body.images.length; i++) {
        const image = body.images[i]
        let url = image.url
        if (image.file) {
          const base64 = image.file.split(',')[1]
          const buffer = Buffer.from(base64, 'base64')
          const ext = image.file.split(';')[0].split('/')[1] || 'png'
          const filename = `image_${Date.now()}_${i}.${ext}`
          const filepath = path.join(process.cwd(), 'public', filename)
          fs.writeFileSync(filepath, buffer)
          url = `/${filename}`
        }
        if (url) {
          await prisma.propertyImage.create({
            data: {
              propertyId: id,
              url,
              isCover: i === 0,
            },
          })
          if (i === 0) firstImageUrl = url
        }
      }

      // Update property with first image as imageUrl
      if (firstImageUrl) {
        await prisma.property.update({
          where: { id },
          data: { imageUrl: firstImageUrl },
        })
      } else {
        await prisma.property.update({
          where: { id },
          data: { imageUrl: null },
        })
      }
    }

    return NextResponse.json(property)
  } catch (error) {
    console.log('Error in PUT:', error)
    return NextResponse.json({ error: `Error updating property: ${error.message}` }, { status: 500 })
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