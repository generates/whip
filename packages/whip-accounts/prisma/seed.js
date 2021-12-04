import prismaClient from '@prisma/client'
import { roll } from '@generates/roll'

const { PrismaClient } = prismaClient
const prisma = new PrismaClient()

async function main () {
  await prisma.account.deleteMany({ where: {} })
}

main()
  .catch(err => {
    roll.error(err)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
