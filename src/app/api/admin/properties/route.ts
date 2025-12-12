import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

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
  const body = await request.json()

  const title = body.title
  const price = body.price
  const pricePerMonth = body.pricePerMonth
  const description = body.description
  const status = body.status
  const rentalType = body.rentalType || 'DAILY'
  const maxGuests = body.maxGuests
  const bedrooms = body.bedrooms
  const bathrooms = body.bathrooms
  const address = body.address
  const mapUrl = body.mapUrl
  const whatsappNumber = body.whatsappNumber

  try {
    const property = await prisma.property.create({
      data: {
        title,
        price,
        pricePerMonth,
        description,
        status,
        rentalType,
        maxGuests,
        bedrooms,
        bathrooms,
        address,
        mapUrl,
        whatsappNumber,
      },
    })

    let firstImageUrl = ''
    if (body.images && body.images.length > 0) {
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
              propertyId: property.id,
              url,
              isCover: i === 0,
            },
          })
          if (i === 0) firstImageUrl = url
        }
      }
    }

    if (firstImageUrl) {
      await prisma.property.update({
        where: { id: property.id },
        data: { imageUrl: firstImageUrl },
      })
    }

    // Revalidar la página principal para mostrar la nueva propiedad
    revalidatePath('/')

    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating property' }, { status: 500 })
  }
}