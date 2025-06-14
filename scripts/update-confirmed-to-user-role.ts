import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.users.updateMany({
    where: { role: 'confirmed' },
    data: { role: 'user' },
  })
  console.log(`Updated ${result.count} users from 'confirmed' to 'user' role.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
