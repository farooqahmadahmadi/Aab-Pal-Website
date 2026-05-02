const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ================= USERS UPLOAD DIR =================
const userDir = path.join(__dirname, "../uploads/users");

// create folder if not exists
if (!fs.existsSync(userDir)) {
  fs.mkdirSync(userDir, { recursive: true });
}

// ================= STORAGE CONFIG =================
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, userDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    // stable naming: user-<id>-timestamp.ext
    const userId = req.params.id || "temp";
    const timestamp = Date.now();

    cb(null, `user-${userId}-${timestamp}${ext}`);
  },
});

// ================= FILE FILTER (OPTIONAL BUT SAFE) =================
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// ================= MULTER INSTANCE =================
const uploadUser = multer({
  storage: userStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

// ================= EXPORT =================
module.exports = {
  uploadUser,
};