const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");

const {
  getAll,
  getOne,
  getByPage,
  create,
  update,
  remove,
} = require("../controllers/webPageViewStats.controller");

// ================= ROUTES =================
router.get("/", getAll);
router.get("/:id", getOne);

// custom route
router.get("/page/:pageId", getByPage);

router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

module.exports = router;
