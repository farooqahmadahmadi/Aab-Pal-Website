/* Access Controls
Admin - Full Access
HR - No Access
Financial - No Access
Project Manager - View and Edit Access (Only for their projects)
Employee - No Access
Client - View Access (Only for their projects)
*/

const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin","Project Manager"), projectController.getAllProjects);
router.get("/:id", role("Admin","Project Manager","Client"), projectController.getProjectById);
router.post("/", role("Admin"), projectController.createProject);
router.put("/:id", role("Admin","Project Manager") projectController.updateProject);
router.delete("/:id",  roel ("Admin"), projectController.deleteProject);

module.exports = router;