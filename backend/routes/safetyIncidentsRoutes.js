const router = require("express").Router();

const controller = require("../controllers/safetyIncidentsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ===== GET ALL =====
router.get("/", authMiddleware, controller.getAll);

// ===== CREATE =====
router.post("/", authMiddleware, controller.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, controller.update);

// ===== DELETE =====
router.delete("/:id", authMiddleware, controller.remove);

module.exports = router;
