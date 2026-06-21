import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient().$extends(withAccelerate());
}

// In dev, hot reload can keep a stale Prisma client after schema changes.
// Recreate when expected delegates are missing (e.g. after prisma generate).
const cached = globalForPrisma.prisma;
const hasRequiredDelegates = 
  cached && 
  typeof cached.demoRequest?.findFirst === "function" &&
  typeof cached.blogQuery?.findFirst === "function";

export const prisma = hasRequiredDelegates ? cached : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
