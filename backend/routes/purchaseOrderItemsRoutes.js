const express = require("express");
const router = express.Router();

const purchaseOrderItemsController = require("../controllers/purchaseOrderItemsController");

router.get("/", purchaseOrderItemsController.getAllPurchaseOrderItems);
router.get("/:id", purchaseOrderItemsController.getPurchaseOrderItemById);
router.post("/", purchaseOrderItemsController.createPurchaseOrderItem);
router.put("/:id", purchaseOrderItemsController.updatePurchaseOrderItem);
router.delete("/:id", purchaseOrderItemsController.deletePurchaseOrderItem);

module.exports = router;