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

const boqItemsController = require("../controllers/boqItemsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), boqItemsController.getAllBoqItems);
router.get("/:id", role("Admin"), boqItemsController.getBoqItemById);
router.post("/", role("Admin"), boqItemsController.createBoqItem);
router.put("/:id", role("Admin"), boqItemsController.updateBoqItem);
router.delete("/:id", role("Admin"), boqItemsController.deleteBoqItem);

module.exports = router;