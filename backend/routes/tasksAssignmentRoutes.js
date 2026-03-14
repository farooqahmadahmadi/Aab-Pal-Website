/* Access Controls
Admin - Full Access
HR - Create,  Read Access
Financial - Create, Read Access
Project Manager - Create, Read Access
Employee - Read Access
Client - No Access
*/

const express = require("express");
const router = express.Router();

const tasksAssignmentController = require("../controllers/tasksAssignmentController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR", "Financial", "Project Manager", "Employee"), tasksAssignmentController.getAllTasks);
router.get("/:id", role("Admin", "HR", "Financial", "Project Manager", "Employee"), tasksAssignmentController.getTaskById);
router.post("/", role("Admin", "HR", "Financial", "Project Manager"), tasksAssignmentController.createTask);
router.put("/:id", role("Admin", "HR", "Financial", "Project Manager"), tasksAssignmentController.updateTask);
router.delete("/:id", role("Admin"), tasksAssignmentController.deleteTask);

module.exports = router;