'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().optional(),
  checkIn: z.string().optional().refine(val => !val || new Date(val) >= new Date(), 'Check-in must be today or later'),
  checkOut: z.string().optional(),
}).refine(data => {
  if (data.checkIn && data.checkOut) {
    return new Date(data.checkOut) > new Date(data.checkIn)
  }
  return true
}, {
  message: 'Check-out must be after check-in',
  path: ['checkOut']
})

export async function createLead(formData: FormData, propertyId: string) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string || undefined,
    message: formData.get('message') as string || undefined,
    checkIn: formData.get('checkIn') as string || undefined,
    checkOut: formData.get('checkOut') as string || undefined,
  }

  const validated = leadSchema.parse(data)

  await prisma.lead.create({
    data: {
      propertyId,
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      message: validated.message,
      checkIn: validated.checkIn ? new Date(validated.checkIn) : null,
      checkOut: validated.checkOut ? new Date(validated.checkOut) : null,
    }
  })

  return { success: true }
}