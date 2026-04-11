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
if (!fs.existsSync(companyDocDir))
  fs.mkdirSync(companyDocDir, { recursive: true });

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
if (!fs.existsSync(employeeDocDir))
  fs.mkdirSync(employeeDocDir, { recursive: true });

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

// ===== Project Documents folder =====
const projectDocDir = path.join(__dirname, "../uploads/documents/projects");
if (!fs.existsSync(projectDocDir))
  fs.mkdirSync(projectDocDir, { recursive: true });

const projectDocStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, projectDocDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `doc-${timestamp}${ext}`);
  },
});
const uploadProjectDoc = multer({ storage: projectDocStorage });

// ===== Equipment Documents folder =====
const equipmentDocDir = path.join(__dirname, "../uploads/documents/equipments");
if (!fs.existsSync(equipmentDocDir))
  fs.mkdirSync(equipmentDocDir, { recursive: true });

const equipmentDocStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, equipmentDocDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `doc-${timestamp}${ext}`);
  },
});
const uploadEquipmentDoc = multer({ storage: equipmentDocStorage });

// ===== Contract Documents folder =====
const contractDir = path.join(__dirname, "../uploads/documents/contracts");
if (!fs.existsSync(contractDir)) fs.mkdirSync(contractDir, { recursive: true });

const contractStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, contractDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `contract-${timestamp}${ext}`);
  },
});

const uploadContract = multer({ storage: contractStorage });



// ===== User Profile Images folder =====
const userDir = path.join(__dirname, "../uploads/documents/users");
if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, userDir),

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    // use user id if exists (update/photo)
    const userId = req.params.id || Date.now();

    cb(null, `user-${userId}${ext}`);
  },
});

const uploadUser = multer({ storage: userStorage });


// ===== Export all uploads =====
module.exports = {
  uploadLogo,
  uploadDoc,
  upload,
  uploadClient,
  uploadProjectDoc,
  uploadEquipmentDoc,
  uploadContract,
  uploadUser,
};
