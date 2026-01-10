import { prisma } from './prisma'

/**
 * Genera un slug a partir de un título
 * Convierte a minúsculas, reemplaza espacios y caracteres especiales por guiones
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-|-$/g, '') // Eliminar guiones al inicio y final
    .substring(0, 100) // Limitar longitud
}

/**
 * Genera un slug único verificando colisiones en la base de datos
 * Si existe, agrega un contador incremental (ej: casa-centro-1, casa-centro-2)
 */
export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 0

  while (true) {
    // Buscar si existe el slug (excluyendo la propiedad actual si estamos editando)
    const existing = await prisma.property.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    })

    if (!existing) {
      return slug
    }

    // Si existe, agregar contador
    counter++
    slug = `${baseSlug}-${counter}`
  }
}
