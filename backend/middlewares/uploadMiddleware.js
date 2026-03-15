const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Map sections to their folders
const folderMap = {
    contracts: "uploads/documents/contracts",
    employees: "uploads/documents/employees",
    projects: "uploads/documents/projects"
};

// Dynamic storage based on section
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const section = req.body.section; // system decides section
        const uploadPath = folderMap[section] || "uploads/documents/others";

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xlsx|ppt|pptx|zip|rar/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error("Only images and document files are allowed"));
};

// Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;