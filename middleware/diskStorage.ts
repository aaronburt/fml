// src/storage.ts

import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { fileURLToPath } from "url";
import prisma from "../prismaClient.js";
import { Request } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, "..", "./storage");

type FilenameCallback = (err: Error | null, filename: string) => void;

const generateUniqueFilename = (extension: string, cb: FilenameCallback): void => {
    const attemptLimit = 5;
    let attempts = 0;

    const tryGenerate = () => {
        if (attempts >= attemptLimit) {
            return cb(new Error("Failed to generate a unique filename after multiple attempts."), '');
        }

        const randomStr = crypto.randomBytes(12).toString("base64url");
        const filename = `${randomStr}${extension}`;
        const filePath = path.join(STORAGE_DIR, filename);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return cb(null, filename);
            } else {
                attempts += 1;
                tryGenerate();
            }
        });
    };

    tryGenerate();
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, STORAGE_DIR);
    },
    filename: (_req: Request, file, cb) => {
        const extension = path.extname(file.originalname);
        generateUniqueFilename(extension, async (err, filename) => {
            if (err) {
                return cb(err, file.originalname);
            }

            try {
                const record = await prisma.file.create({
                    data: {
                        filename,
                        originalName: file.originalname,
                        size: 0, // Update as needed
                        type: file.mimetype,
                    },
                });

                // Attach the record ID to the request object
                _req.fileId = record.id;

                cb(null, filename);
            } catch (dbError) {
                cb(dbError as Error, file.originalname);
            }
        });
    },
});

export default storage;