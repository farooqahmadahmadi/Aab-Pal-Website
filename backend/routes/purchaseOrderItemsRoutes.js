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

const purchaseOrderItemsController = require("../controllers/purchaseOrderItemsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), purchaseOrderItemsController.getAllPurchaseOrderItems);
router.get("/:id", role("Admin"), purchaseOrderItemsController.getPurchaseOrderItemById);
router.post("/", role("Admin"), purchaseOrderItemsController.createPurchaseOrderItem);
router.put("/:id", role("Admin"), purchaseOrderItemsController.updatePurchaseOrderItem);
router.delete("/:id", role("Admin"), purchaseOrderItemsController.deletePurchaseOrderItem);

module.exports = router;