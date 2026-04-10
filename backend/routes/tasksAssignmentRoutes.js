const router = require("express").Router();

const ctrl = require("../controllers/tasksAssignmentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ===== GET ALL =====
router.get("/", authMiddleware, ctrl.getAll);

// ===== CREATE =====
router.post("/", authMiddleware, ctrl.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, ctrl.update);

// ===== DELETE =====
router.delete("/:id", authMiddleware, ctrl.remove);

module.exports = router;
