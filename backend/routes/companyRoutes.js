const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { uploadLogo } = require("../middlewares/uploadMiddleware");
const {
    getCompanyInfo,
    createCompanyInfo,
    updateCompanyInfo,
} = require("../controllers/companyController");

// GET company info
router.get("/", authMiddleware, getCompanyInfo);

// CREATE company info (only once)
router.post("/", authMiddleware, uploadLogo.single("logo"), createCompanyInfo);

// UPDATE company info
router.put("/", authMiddleware, uploadLogo.single("logo"), updateCompanyInfo);

module.exports = router;
