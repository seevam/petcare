import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Construct DATABASE_URL with pgbouncer parameter if needed
let databaseUrl = process.env.DATABASE_URL;

// If using transaction mode pooler, add pgbouncer=true parameter
// This tells Prisma to disable prepared statements
if (databaseUrl && !databaseUrl.includes("pgbouncer=true") && databaseUrl.includes(":6543")) {
  const separator = databaseUrl.includes("?") ? "&" : "?";
  databaseUrl = `${databaseUrl}${separator}pgbouncer=true`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
