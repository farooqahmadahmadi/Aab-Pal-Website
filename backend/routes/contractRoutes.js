const express = require("express");
const router = express.Router();
const { uploadContract } = require("../middlewares/uploadMiddleware");
const ctrl = require("../controllers/contractController");

router.get("/", ctrl.getAll);
router.post("/", uploadContract.single("file"), ctrl.create);
router.put("/:id", uploadContract.single("file"), ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;