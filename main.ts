import express from "express";
import multer from "multer";
import { bearerTokenAuth } from "./middleware/bearerTokenAuth.js";
import storage from "./middleware/diskStorage.js";

const app = express();
const PORT = 3000;

const upload = multer({ storage });

app.post("/upload", bearerTokenAuth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    return res.status(200).json({
      message: "File uploaded successfully",
      file: req.file.originalname,
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