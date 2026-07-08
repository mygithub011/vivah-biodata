// Run `npx prisma generate` after setting up DATABASE_URL to generate the Prisma client.
// Prisma 7 requires an adapter — using @prisma/adapter-pg with the `pg` driver.
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // During build/test without a real DB, return a no-op proxy so imports don't fail
    return new Proxy({} as any, {
      get: () => () => Promise.resolve(null),
    });
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: any };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;



