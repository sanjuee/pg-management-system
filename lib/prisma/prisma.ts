import { PrismaClient } from "@/app/generated/prisma"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Invalidate cache to load new schema changes
globalForPrisma.prisma = undefined;

// 1. Initialize the Postgres connection pool
const pool = new Pool({ connectionString })

// 2. Initialize the Prisma Adapter
const adapter = new PrismaPg(pool)

// 3. Pass the adapter as the required argument
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma