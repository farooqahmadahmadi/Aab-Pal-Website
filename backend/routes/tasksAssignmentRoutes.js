const express = require("express");
const router = express.Router();

const tasksAssignmentController = require("../controllers/tasksAssignmentController");

router.get("/", tasksAssignmentController.getAllTasks);
router.get("/:id", tasksAssignmentController.getTaskById);
router.post("/", tasksAssignmentController.createTask);
router.put("/:id", tasksAssignmentController.updateTask);
router.delete("/:id", tasksAssignmentController.deleteTask);

module.exports = router;