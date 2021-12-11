import prismaClient from '@prisma/client'
import { roll } from '@generates/roll'
import { accounts } from '../tests/fixtures/accounts.js'

const { PrismaClient } = prismaClient
const prisma = new PrismaClient()

async function main () {
  await prisma.account.deleteMany({ where: {} })
  await prisma.account.createMany({ data: accounts })
}

main()
  .catch(err => {
    roll.error('Seed failed', err)
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
