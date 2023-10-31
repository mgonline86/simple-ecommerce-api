/* Ensure one Prisma Client is used across the App */

import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
    var __db: PrismaClient | undefined;
}

if (!global.__db) {
    global.__db = new PrismaClient();
}

db = global.__db;

export { db };