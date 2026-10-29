const multer = require("multer")
const path = require("path")
const fs = require("fs")
const {randomUUID} = require("crypto")

const uploadDirectory = path.resolve(process.cwd(), "uploads", "products");

fs.mkdirSync(uploadDirectory, {recursive: true});

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp"
])

const extensionByMimeType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const extension = extensionByMimeType[file.mimetype];

        if (!extension) {
            return callback(new Error("Unsupported image format."));
        }

        callback(null, `${randomUUID()}${extension}`);
    }
});

const fileFilter = (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
        return callback(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }

    callback(null, true);
}

const uploadProductImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files:1
    }
});

module.exports = { uploadProductImage, uploadDirectory }