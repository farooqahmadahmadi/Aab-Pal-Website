const express = require("express");
const router = express.Router();
const controller = require("../controllers/clientInfoController");
const { uploadClient } = require("../middlewares/uploadMiddleware");

router.get("/", controller.getAllClients);
router.get("/:id", controller.getClientById);
router.post("/", uploadClient.single("client_photo"), controller.addClient);
router.put("/:id", uploadClient.single("client_photo"), controller.updateClient);
router.delete("/:id", controller.deleteClient);

module.exports = router;