/* Access Controls
Admin - Full Access
HR - No Access
Financial - No Access
Project Manager - No Access
Employee - No Access
Client - No Access
*/

const express = require("express");
const router = express.Router();

const tasksAssignmentController = require("../controllers/tasksAssignmentController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), tasksAssignmentController.getAllTasks);
router.get("/:id", role("Admin"), tasksAssignmentController.getTaskById);
router.post("/", role("Admin"), tasksAssignmentController.createTask);
router.put("/:id", role("Admin"), tasksAssignmentController.updateTask);
router.delete("/:id", role("Admin"), tasksAssignmentController.deleteTask);

module.exports = router;