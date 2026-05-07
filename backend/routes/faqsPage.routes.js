const express = require("express");
const router = express.Router();

const {
  authMiddleware,
} = require("../middlewares/auth.middleware");

const {
  getAll,
  getOne,
  create,
  createPublicQuestion,
  update,
  remove,
} = require("../controllers/faqsPage.controller");

// ================= PUBLIC ROUTES =================
router.get("/", getAll);

router.get("/:id", getOne);

// 🔥 PUBLIC ASK QUESTION
router.post("/ask", createPublicQuestion);

// ================= ADMIN ROUTES =================
router.post("/", authMiddleware, create);

router.put("/:id", authMiddleware, update);

router.delete("/:id", authMiddleware, remove);

module.exports = router;