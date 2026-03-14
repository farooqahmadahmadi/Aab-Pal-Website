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

const purchaseOrdersController = require("../controllers/purchaseOrdersController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), purchaseOrdersController.getAllPurchaseOrders);
router.get("/:id", role("Admin"), purchaseOrdersController.getPurchaseOrderById);
router.post("/", role("Admin"), purchaseOrdersController.createPurchaseOrder);
router.put("/:id", role("Admin"), purchaseOrdersController.updatePurchaseOrder);
router.delete("/:id", role("Admin"), purchaseOrdersController.deletePurchaseOrder);

module.exports = router;