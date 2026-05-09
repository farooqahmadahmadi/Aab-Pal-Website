const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ================= USERS UPLOAD DIR =================
const userDir = path.join(__dirname, "../uploads/users");

if (!fs.existsSync(userDir)) {
  fs.mkdirSync(userDir, { recursive: true });
}

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, userDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const userId = req.params.id || "temp";
    const timestamp = Date.now();
    cb(null, `user-${userId}-${timestamp}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  cb(null, allowed.includes(file.mimetype));
};

const uploadUser = multer({
  storage: userStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= ABOUT PAGE =================
const aboutDir = path.join(__dirname, "../uploads/about_page");

if (!fs.existsSync(aboutDir)) {
  fs.mkdirSync(aboutDir, { recursive: true });
}

const uploadAbout = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, aboutDir),
    filename: (req, file, cb) =>
      cb(null, `about-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= HOME PAGE =================
const homeDir = path.join(__dirname, "../uploads/home_page");

if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir, { recursive: true });
}

const uploadHome = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, homeDir),
    filename: (req, file, cb) =>
      cb(null, `home-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= BLOGS MAIN IMAGE =================
const blogDir = path.join(__dirname, "../uploads/blogs_page");

if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

const uploadBlog = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, blogDir),
    filename: (req, file, cb) =>
      cb(
        null,
        `blog-${req.body.blog_id || "new"}-${Date.now()}${path.extname(file.originalname)}`,
      ),
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ================= BLOG COMMENTS =================
const commentDir = path.join(__dirname, "../uploads/blog_comments");

if (!fs.existsSync(commentDir)) {
  fs.mkdirSync(commentDir, { recursive: true });
}

const uploadComment = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, commentDir),
    filename: (req, file, cb) =>
      cb(null, `comment-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= ⭐ NEW: BLOG IMAGES (MULTIPLE IMAGES) =================
const blogImagesDir = path.join(__dirname, "../uploads/blog_images");

if (!fs.existsSync(blogImagesDir)) {
  fs.mkdirSync(blogImagesDir, { recursive: true });
}

const uploadBlogImages = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, blogImagesDir),

    filename: (req, file, cb) => {
      const blogId = req.body.blog_id || "new";
      const imageId = Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(
        null,
        `blog-${blogId}-img-${imageId}${path.extname(file.originalname)}`,
      );
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ================= TESTIMONIALS =================
const testimonialDir = path.join(__dirname, "../uploads/testimonials_page");

if (!fs.existsSync(testimonialDir)) {
  fs.mkdirSync(testimonialDir, { recursive: true });
}

const uploadTestimonials = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, testimonialDir),
    filename: (req, file, cb) =>
      cb(null, `testimonial-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= OUR TEAM =================
const teamDir = path.join(__dirname, "../uploads/our_team_page");

if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

const uploadTeam = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, teamDir),
    filename: (req, file, cb) =>
      cb(null, `team-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= PROJECTS =================
const projectDir = path.join(__dirname, "../uploads/our_projects_page");

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

const uploadProject = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, projectDir),
    filename: (req, file, cb) =>
      cb(null, `project-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= SERVICES =================
const servicesDir = path.join(__dirname, "../uploads/services_page");

if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

const uploadServices = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, servicesDir),
    filename: (req, file, cb) =>
      cb(null, `service-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= EXPORT =================
module.exports = {
  uploadUser,
  uploadAbout,
  uploadHome,
  uploadBlog,
  uploadComment,
  uploadBlogImages, // ⭐ NEW ADDED ONLY
  uploadTestimonials,
  uploadTeam,
  uploadProject,
  uploadServices,
};
