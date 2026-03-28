const express = require("express");
const router = express.Router();
const { uploadEquipmentDoc } = require("../middlewares/uploadMiddleware");

const ctrl = require("../controllers/equipmentDocumentsController");

router.get("/", ctrl.getAll);
router.post("/", uploadEquipmentDoc.single("doc_file"), ctrl.create);
router.put("/:id", uploadEquipmentDoc.single("doc_file"), ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;