/* Access Controls
Admin - Full Access
HR - No Access
Financial - No Access
Project Manager - View Access
Employee - No Access 
Client - View Access (Only their own data)
*/

const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Project Manager", "Client"), clientController.getAllClients);
router.get("/:id", role("Admin", "Project Manager", "Client"), clientController.getClientById);
router.post("/", role("Admin"), clientController.createClient);
router.put("/:id", role("Admin"), clientController.updateClient);
router.delete("/:id", role("Admin"), clientController.deleteClient);

module.exports = router;