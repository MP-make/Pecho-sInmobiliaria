import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Inicializando usuario admin...')

  const email = 'mp@mp.com'
  const password = 'mp'

  try {
    // Verificar si ya existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('✅ Usuario admin ya existe')
      console.log('   Email:', email)
      console.log('   Contraseña: mp')
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

    console.log('✅ Usuario admin creado exitosamente!')
    console.log('   Email:', adminUser.email)
    console.log('   Contraseña: mp')
    console.log('')
    console.log('🚀 Ahora puedes acceder al panel admin en:')
    console.log('   http://localhost:3000/admin/login')
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
