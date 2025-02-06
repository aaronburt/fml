import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            fileId?: string; // Adjust the type based on your Prisma schema
        }
    }
}