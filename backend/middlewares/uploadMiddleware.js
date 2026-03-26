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

// ===== Company Documents folder =====
const companyDocDir = path.join(__dirname, "../uploads/documents/company");
if (!fs.existsSync(companyDocDir)) fs.mkdirSync(companyDocDir, { recursive: true });

const companyDocStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, companyDocDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `doc-${timestamp}${ext}`);
  },
});
const uploadDoc = multer({ storage: companyDocStorage });

// ===== Employee Documents folder =====
const employeeDocDir = path.join(__dirname, "../uploads/documents/employees");
if (!fs.existsSync(employeeDocDir)) fs.mkdirSync(employeeDocDir, { recursive: true });

const employeeDocStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, employeeDocDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: employeeDocStorage });


// ===== Client Documents =====
const clientDir = path.join(__dirname, "../uploads/documents/client");
if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });

const clientStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, clientDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "client-" + unique + ext);
  },
});

const uploadClient = multer({ storage: clientStorage });


// ===== Export all uploads =====
module.exports = { uploadLogo, uploadDoc, upload, uploadClient };