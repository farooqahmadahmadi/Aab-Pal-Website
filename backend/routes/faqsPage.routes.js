const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/faqsPage.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

router.post("/", authMiddleware, create);

router.put("/:id", authMiddleware, update);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
