import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { bearerTokenAuth } from "./middleware/bearerTokenAuth.js";
import storage from "./middleware/diskStorage.js";
import fs from "fs";
import prisma from "./prismaClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const STATIC_DIR = path.join(__dirname, "static");
const STORAGE_DIR = path.join(__dirname, "storage");
const CSS_DIR = path.join(STATIC_DIR, "css");
const JS_DIR = path.join(STATIC_DIR, "js");

const upload = multer({ storage });

const ERROR_MESSAGES = {
  NO_FILE_PROVIDED: "No file provided",
  FILE_PARAM_REQUIRED: "File parameter is required.",
  FILE_NOT_FOUND: "File not found.",
  UNEXPECTED_ERROR: "Unexpected error occurred",
};

const getFileRecord = async (id: string) => {
  return prisma.file.findUnique({
    where: {id},
    select: {
      filename: true,
      originalName: true,
      type: true,
    },
  });
};

const sendFileResponse = async (res: Response, id: string) => {
  try {
    const fileRecord = await getFileRecord(id);
    if (!fileRecord) {
      return res.status(404).json({ message: ERROR_MESSAGES.FILE_NOT_FOUND });
    }

    const filePath = path.join(STORAGE_DIR, fileRecord.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: ERROR_MESSAGES.FILE_NOT_FOUND });
    }

    return res.sendFile(filePath);
  } catch (error) {
    console.error("Error retrieving file:", error);
    return res.status(500).json({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
  }
};

// Serve Static Files
app.use("/files", express.static(STORAGE_DIR));
app.use("/css", express.static(CSS_DIR));
app.use("/js", express.static(JS_DIR));

// Routes
app.get("/", (_req: Request, res: Response) => {
  return res.sendFile(path.join(STATIC_DIR, "index.html"));
});

app.get("/view", (_req: Request, res: Response) => {
  return res.sendFile(path.join(STATIC_DIR, "preview.html"));
});

app.get("/api/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fileRecord = await getFileRecord(id);
    if (!fileRecord) {
      return res.status(404).json({ message: ERROR_MESSAGES.FILE_NOT_FOUND });
    }
    return res.json(fileRecord);
  } catch (error) {
    console.error("Error fetching file record:", error);
    return res.status(500).json({ message: ERROR_MESSAGES.UNEXPECTED_ERROR });
  }
});

app.get("/file", async (req: Request, res: Response) => {
  const { id } = req.query as { id?: string };

  if (!id) {
    return res.status(400).send(ERROR_MESSAGES.FILE_PARAM_REQUIRED);
  }

  await sendFileResponse(res, id);
});

app.post(
    "/upload",
    bearerTokenAuth,
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: ERROR_MESSAGES.NO_FILE_PROVIDED });
        }

        const fileId = (req as any).fileId;
        console.log(fileId);

        return res.status(200).json({
          id: fileId,
          message: "File uploaded successfully",
          file: req.file.filename,
          original: req.file.originalname,
        });
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
          error: ERROR_MESSAGES.UNEXPECTED_ERROR,
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }
);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});