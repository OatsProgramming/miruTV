import { PrismaClient } from '@prisma/client'

const globalPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const prismadb =
  globalPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalPrisma.prisma = prismadb

export default prismadb