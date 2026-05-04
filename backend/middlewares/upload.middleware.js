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

// ================= ABOUTE PAGE =================

const aboutDir = path.join(__dirname, "../uploads/about_page");

// create folder if not exists
if (!fs.existsSync(aboutDir)) {
  fs.mkdirSync(aboutDir, { recursive: true });
}

const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, aboutDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `about-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const uploadAbout = multer({
  storage: aboutStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= HOME PAGE =================
const homeDir = path.join(__dirname, "../uploads/home_page");

if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir, { recursive: true });
}

const homeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, homeDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `home-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const uploadHome = multer({
  storage: homeStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= BLOG UPLOAD =================
const blogDir = path.join(__dirname, "../uploads/blogs_page");

if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `blog-${Date.now()}${ext}`);
  },
});

const uploadBlog = multer({
  storage: blogStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= BLOG COMMENTS DIR =================
const commentDir = path.join(__dirname, "../uploads/blog_comments");

if (!fs.existsSync(commentDir)) {
  fs.mkdirSync(commentDir, { recursive: true });
}

const commentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, commentDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `comment-${Date.now()}${ext}`);
  },
});

const uploadComment = multer({
  storage: commentStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= EXPORT =================
module.exports = {
  uploadUser,
  uploadAbout,
  uploadHome,
  uploadBlog,
  uploadComment,
};
