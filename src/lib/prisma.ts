import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if database environment variables are available
const isDatabaseAvailable = () => {
  return !!(process.env.DATABASE_URL && process.env.DIRECT_URL)
}

// Create Prisma client only if database is available
const createPrismaClient = () => {
  if (!isDatabaseAvailable()) {
    console.warn('⚠️ Database environment variables not available, Prisma client not initialized')
    return null
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    })
  } catch (error) {
    console.error('❌ Error creating Prisma client:', error)
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

// Helper function to check if Prisma is available
export const isPrismaAvailable = () => {
  return !!(prisma && isDatabaseAvailable())
}