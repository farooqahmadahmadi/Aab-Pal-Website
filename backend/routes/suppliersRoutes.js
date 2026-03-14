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

const suppliersController = require("../controllers/suppliersController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), suppliersController.getAllSuppliers);
router.get("/:id", role("Admin"), suppliersController.getSupplierById);
router.post("/", role("Admin"), suppliersController.createSupplier);
router.put("/:id", role("Admin"), suppliersController.updateSupplier);
router.delete("/:id", role("Admin"), suppliersController.deleteSupplier);

module.exports = router;