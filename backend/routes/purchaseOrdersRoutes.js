const express = require("express");
const router = express.Router();

const purchaseOrdersController = require("../controllers/purchaseOrdersController");

router.get("/", purchaseOrdersController.getAllPurchaseOrders);
router.get("/:id", purchaseOrdersController.getPurchaseOrderById);
router.post("/", purchaseOrdersController.createPurchaseOrder);
router.put("/:id", purchaseOrdersController.updatePurchaseOrder);
router.delete("/:id", purchaseOrdersController.deletePurchaseOrder);

module.exports = router;