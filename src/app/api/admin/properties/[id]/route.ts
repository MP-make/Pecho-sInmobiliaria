import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug } from '@/lib/slug'
import { revalidatePath } from 'next/cache'
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
      include: { 
        propertyImages: true,
        amenities: true 
      },
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
    
    // Obtener la propiedad actual para comparar el título
    const currentProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!currentProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Regenerar slug si el título cambió
    let slug = currentProperty.slug
    if (body.title && body.title !== currentProperty.title) {
      slug = await generateUniqueSlug(body.title, id)
    }
    
    // Update property basic info with proper type casting
    const updateData: any = {
      title: body.title,
      slug,
      price: body.price,
      description: body.description,
      status: body.status,
      pricePerMonth: body.pricePerMonth,
      maxGuests: body.maxGuests,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      address: body.address,
      mapUrl: body.mapUrl,
      whatsappNumber: body.whatsappNumber,
    }
    
    // Add rentalType if provided
    if (body.rentalType) {
      updateData.rentalType = body.rentalType
    }
    
    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    })

    // Handle amenities if provided
    if (body.amenities && Array.isArray(body.amenities)) {
      // Delete all existing amenities for this property
      await prisma.amenity.deleteMany({
        where: { propertyId: id },
      })

      // Create new amenities
      for (const amenityName of body.amenities) {
        if (amenityName && amenityName.trim()) {
          await prisma.amenity.create({
            data: {
              name: amenityName.trim(),
              propertyId: id,
            },
          })
        }
      }
    }

    // Handle images if provided
    if (body.images && Array.isArray(body.images)) {
      // Get old images to compare
      const oldImages = await prisma.propertyImage.findMany({
        where: { propertyId: id },
      })
      
      // Process new images and keep track of which ones to keep
      const newImageUrls: string[] = []
      
      for (let i = 0; i < body.images.length; i++) {
        const image = body.images[i]
        let url = image.url
        
        // If there's a new file uploaded (base64), save it
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
            continue
          }
        }
        
        // Only add if we have a valid URL
        if (url) {
          newImageUrls.push(url)
        }
      }
      
      // Delete old images that are no longer in the new list
      for (const img of oldImages) {
        if (!newImageUrls.includes(img.url)) {
          // Delete from disk if it's a local file
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
      }
      
      // Delete all old image records and recreate
      await prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      })

      // Create new image records
      let firstImageUrl = ''
      for (let i = 0; i < newImageUrls.length; i++) {
        const url = newImageUrls[i]
        await prisma.propertyImage.create({
          data: {
            propertyId: id,
            url,
            isCover: i === 0,
          },
        })
        if (i === 0) firstImageUrl = url
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

    // Revalidar las páginas para mostrar los cambios
    revalidatePath('/')
    revalidatePath(`/property/${id}`)

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
    
    // Revalidar la página principal para mostrar que se eliminó
    revalidatePath('/')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting property' }, { status: 500 })
  }
}