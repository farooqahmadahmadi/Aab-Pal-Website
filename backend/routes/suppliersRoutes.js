const express = require("express");
const router = express.Router();

const suppliersController = require("../controllers/suppliersController");

router.get("/", suppliersController.getAllSuppliers);
router.get("/:id", suppliersController.getSupplierById);
router.post("/", suppliersController.createSupplier);
router.put("/:id", suppliersController.updateSupplier);
router.delete("/:id", suppliersController.deleteSupplier);

module.exports = router;