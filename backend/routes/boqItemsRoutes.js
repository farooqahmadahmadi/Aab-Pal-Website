const express = require("express");
const router = express.Router();

const boqItemsController = require("../controllers/boqItemsController");

router.get("/", boqItemsController.getAllBoqItems);
router.get("/:id", boqItemsController.getBoqItemById);
router.post("/", boqItemsController.createBoqItem);
router.put("/:id", boqItemsController.updateBoqItem);
router.delete("/:id", boqItemsController.deleteBoqItem);

module.exports = router;