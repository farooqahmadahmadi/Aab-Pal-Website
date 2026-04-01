const router = require("express").Router();
const controller = require("../controllers/safetyIncidentsController");

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
