import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "./storage"));
    },
    filename: (req, file, cb) => {
        try {
            const extension = path.extname(file.originalname);
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const randomStr = crypto.randomBytes(16).toString("hex");
            cb(null, `${timestamp}-${randomStr}${extension}`);
        } catch (error) {
            cb(error as Error, file.originalname);
        }
    },
});

export default storage;
