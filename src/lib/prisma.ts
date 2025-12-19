import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// Create fresh Prisma client for each request to avoid connection state issues
const createFreshPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// Legacy export for existing code
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : [],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Fresh client approach - create new client for each operation
export const withPrisma = async <T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> => {
  let client: PrismaClient | null = null
  let retries = 3
  let lastError: unknown

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Create a fresh client for this operation
      client = createFreshPrismaClient()
      console.log(`🔧 Created fresh Prisma client (attempt ${attempt})`)

      // Connect and execute
      await client.$connect()
      console.log(`✅ Connected on attempt ${attempt}`)

      // Execute the operation with the fresh client
      const result = await operation(client)
      console.log(`✅ Operation completed successfully on attempt ${attempt}`)
      return result

    } catch (error) {
      lastError = error
      console.warn(`⚠️ withPrisma attempt ${attempt} failed:`, error)

      if (attempt === retries) {
        // Last attempt failed, throw error
        const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
        throw new Error(`Database error: ${errorMessage}`)
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    } finally {
      // Always disconnect the client
      if (client) {
        try {
          await client.$disconnect()
          console.log(`🔌 Disconnected client after attempt ${attempt}`)
        } catch (error) {
          console.warn('Warning: Failed to disconnect client:', error)
        }
      }
    }
  }

  throw new Error(`Database operation failed after ${retries} attempts: ${lastError}`)
}

// Helper function to check if Prisma is available
export const isPrismaAvailable = async () => {
  try {
    await withPrisma(async (client) => {
      await client.$queryRaw`SELECT 1`
    })
    return true
  } catch {
    return false
  }
}

// Legacy function for backwards compatibility
export const ensurePrismaConnection = async (retries = 3): Promise<boolean> => {
  return await isPrismaAvailable()
}