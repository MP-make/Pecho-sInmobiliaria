import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

async function migrateSlug() {
  console.log('🔄 Migrando slugs de propiedades existentes...')

  const properties = await prisma.property.findMany()
  const slugCount: Record<string, number> = {}

  for (const property of properties) {
    let baseSlug = generateSlug(property.title)
    
    // Manejar colisiones
    if (slugCount[baseSlug] !== undefined) {
      slugCount[baseSlug]++
      baseSlug = `${baseSlug}-${slugCount[baseSlug]}`
    } else {
      slugCount[baseSlug] = 0
    }

    await prisma.property.update({
      where: { id: property.id },
      data: { slug: baseSlug }
    })

    console.log(`✓ ${property.title} -> ${baseSlug}`)
  }

  console.log(`\n✅ Migración completada: ${properties.length} propiedades actualizadas`)
}

migrateSlug()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
