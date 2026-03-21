const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ===== Logos folder =====
const logoDir = path.join(__dirname, "../uploads/logos");
if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });
const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, logoDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const uploadLogo = multer({ storage: logoStorage });

// ===== Documents folder =====
const docDir = path.join(__dirname, "../uploads/documents/company");
if (!fs.existsSync(docDir)) fs.mkdirSync(docDir, { recursive: true });
const docStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, docDir),
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `doc-${timestamp}${ext}`);
    },
});
const uploadDoc = multer({ storage: docStorage });

module.exports = { uploadLogo, uploadDoc };