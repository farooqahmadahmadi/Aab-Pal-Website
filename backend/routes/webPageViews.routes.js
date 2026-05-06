const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/webPageViews.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

// usually auto tracking وي → auth ته ضرورت نشته
router.post("/", create);

// که admin edit/delete کوي
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

module.exports = router;
