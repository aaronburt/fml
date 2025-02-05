import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { bearerTokenAuth } from "./middleware/bearerTokenAuth.js";
import storage from "./middleware/diskStorage.js";
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const upload = multer({ storage });

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.get("/preview/:files", (req, res) => {
  const filename = req.params.files;

  if (!filename) {
    return res.status(400).send("File parameter is required.");
  }

  const filePath = path.join(__dirname, "storage", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found.");
    }

    res.sendFile(path.join(__dirname, "static", "preview.html"));
  });
});

app.use("/css", express.static(path.join(__dirname, "static", "css")));
app.use("/js", express.static(path.join(__dirname, "static", "js")));

app.use("/files", express.static(path.join(__dirname, "storage")));

app.post("/upload", bearerTokenAuth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    return res.status(200).json({
      message: "File uploaded successfully",
      file: req.file.filename,
      original: req.file.originalname,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected error occurred",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});