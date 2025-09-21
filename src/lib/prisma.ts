import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client and test if it works
const createPrismaClient = () => {
  try {
    // Check if we're in a serverless environment (Vercel)
    const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME

    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      // Disable connection pooling in serverless environments
      ...(isServerless && {
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      }),
    })
  } catch (error) {
    console.warn('⚠️ Error creating Prisma client:', error)
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

// Helper function to check if Prisma is available
export const isPrismaAvailable = async () => {
  if (!prisma) return false

  try {
    // Try a simple query to verify the connection works
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.warn('⚠️ Prisma connection test failed:', error)
    return false
  }
}