const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/contactUsPage.controller");

// ================= ROUTES =================
router.get("/", getAll);

router.get("/:id", getOne);

router.post("/", create);

router.put("/:id", authMiddleware, update);

router.delete("/:id", authMiddleware, remove);

module.exports = router;
