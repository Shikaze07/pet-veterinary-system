import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

type GlobalWithPrisma = {
  prismaAdapter: PrismaMariaDb | undefined;
  prisma: PrismaClient | undefined;
};

const globalForPrisma = globalThis as unknown as GlobalWithPrisma;

// Persist the adapter globally so HMR doesn't create a new connection pool each reload
const adapter =
  globalForPrisma.prismaAdapter ??
  new PrismaMariaDb({
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABASE_PORT ?? "3306", 10),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    // Required for MySQL 8 caching_sha2_password auth plugin over non-TLS proxy
    allowPublicKeyRetrieval: true,
    // Keep pool small to avoid Railway's connection limits
    connectionLimit: 3,
    // Allow extra time for Railway's cold-start proxy
    connectTimeout: 60000,
    // Destroy idle connections before Railway's ~30s proxy timeout closes them
    idleTimeout: 20000,
    // Send keep-alive pings every 10s so the socket isn't silently closed
    keepAliveDelay: 10000,
    // Allow reasonable time to acquire a connection from the pool
    acquireTimeout: 30000,
  });

// Discard a cached client generated before newer models (e.g. costing) existed
const cachedPrisma =
  globalForPrisma.prisma && "costing" in globalForPrisma.prisma ? globalForPrisma.prisma : undefined;
const prisma = cachedPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaAdapter = adapter;
  globalForPrisma.prisma = prisma;
}

export default prisma;