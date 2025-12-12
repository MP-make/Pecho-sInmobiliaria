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
    
    // Update property basic info with proper type casting
    const updateData: any = {
      title: body.title,
      price: body.price,
      description: body.description,
      status: body.status,
      pricePerMonth: body.pricePerMonth,
      maxGuests: body.maxGuests,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      address: body.address,
      mapLat: body.mapLat,
      mapLng: body.mapLng,
    }
    
    // Add rentalType if provided
    if (body.rentalType) {
      updateData.rentalType = body.rentalType
    }
    
    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    })

    // Handle images if provided
    if (body.images && Array.isArray(body.images)) {
      // Delete old images from database
      const oldImages = await prisma.propertyImage.findMany({
        where: { propertyId: id },
      })
      
      // Delete old image files from disk
      for (const img of oldImages) {
        if (img.url.startsWith('/image_')) {
          try {
            const filepath = path.join(process.cwd(), 'public', img.url.slice(1))
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath)
            }
          } catch (err) {
            console.error('Error deleting old image:', err)
          }
        }
      }
      
      await prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      })

      let firstImageUrl = ''
      for (let i = 0; i < body.images.length; i++) {
        const image = body.images[i]
        let url = image.url
        
        // If there's a new file uploaded, save it
        if (image.file && image.file.includes('base64')) {
          try {
            const base64Data = image.file.split(',')[1]
            const buffer = Buffer.from(base64Data, 'base64')
            const mimeType = image.file.split(';')[0].split(':')[1]
            const ext = mimeType.split('/')[1] || 'png'
            const filename = `image_${Date.now()}_${i}.${ext}`
            const filepath = path.join(process.cwd(), 'public', filename)
            fs.writeFileSync(filepath, buffer)
            url = `/${filename}`
          } catch (err) {
            console.error('Error saving image:', err)
          }
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
      }
    }

    // Return updated property with images
    const updatedProperty = await prisma.property.findUnique({
      where: { id },
      include: { 
        propertyImages: true,
        amenities: true 
      },
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error in PUT:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Error updating property: ${message}` }, { status: 500 })
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