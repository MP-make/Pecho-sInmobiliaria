import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'mp@mp.com'
  const password = 'mp'
  
  // Verificar si ya existe
  const existingUser = await prisma.adminUser.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('✓ Usuario admin ya existe')
    return
  }

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash(password, 10)
  const adminUser = await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Administrador'
    }
  })

  console.log('✓ Usuario admin creado:', adminUser.email)
  console.log('  Email:', email)
  console.log('  Password: mp')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    pool.end()
  })
