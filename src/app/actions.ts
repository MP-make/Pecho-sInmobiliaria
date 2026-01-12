'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendLeadNotification } from '@/lib/email'

// --- NUEVO: Schema para el Muro de Seguridad (Actualizado) ---
const securityLeadSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  dni: z.string()
    .min(8, 'El DNI debe tener al menos 8 dígitos')
    .max(12, 'El DNI no debe exceder 12 dígitos')
    .regex(/^\d+$/, 'El DNI solo debe contener números'),
  phone: z.string()
    .min(9, 'El celular debe tener al menos 9 dígitos')
    .regex(/^\d+$/, 'El celular solo debe contener números'),
  email: z.string().email('El correo electrónico no es válido').optional().or(z.literal('')),
  message: z.string().optional(),
})

export async function submitSecurityLead(
  propertyId: string,
  propertyTitle: string,
  data: {
    name: string
    dni: string
    phone: string
    email?: string
    message?: string
  }
) {
  try {
    // Validar datos con Zod
    const validated = securityLeadSchema.parse(data)

    // 🔒 SEGURIDAD: Verificar si el DNI ya existe (evitar duplicados)
    const existingLead = await prisma.lead.findFirst({
      where: { dni: validated.dni }
    })

    if (existingLead) {
      // Si existe, actualizar la información pero no crear duplicado
      await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          propertyId,
          name: validated.name,
          phone: validated.phone,
          email: validated.email || existingLead.email,
          message: validated.message || '',
          status: 'PENDIENTE',
        }
      })
    } else {
      // Crear nuevo lead
      await prisma.lead.create({
        data: {
          propertyId,
          name: validated.name,
          dni: validated.dni,
          email: validated.email || `${validated.dni}@temp.lead`,
          phone: validated.phone,
          message: validated.message || '',
          status: 'PENDIENTE',
        }
      })
    }

    // 📧 ENVIAR NOTIFICACIÓN POR EMAIL AL ADMIN
    const emailResult = await sendLeadNotification({
      leadName: validated.name,
      leadDNI: validated.dni,
      leadPhone: validated.phone,
      leadEmail: validated.email,
      propertyTitle,
      propertyId,
      message: validated.message
    })

    if (!emailResult.success) {
      console.error('⚠️ El lead se guardó pero falló el envío del email:', emailResult.error)
    }

    return { 
      success: true,
      message: '¡Solicitud enviada! Nos pondremos en contacto contigo pronto.'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0].message 
      }
    }
    return { 
      success: false, 
      error: 'Error al procesar la solicitud. Por favor intente nuevamente.' 
    }
  }
}

// --- NUEVO: Función para bloquear/desbloquear DNI ---
export async function toggleBlockDNI(leadId: string, block: boolean) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: block ? 'BLOQUEADO' : 'PENDIENTE' }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar el estado' }
  }
}

// --- NUEVO: Función para obtener todos los leads ---
export async function getAllLeads() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        property: {
          select: {
            title: true,
            slug: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, leads }
  } catch (error) {
    return { success: false, error: 'Error al obtener los leads' }
  }
}