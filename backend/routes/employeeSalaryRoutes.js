const router = require("express").Router();
const {
    listSalaries,
    getSalary,
    createSalary,
    editSalary,
    softDelete
} = require("../controllers/employeeSalaryController");

router.get("/", listSalaries);
router.get("/:id", getSalary);
router.post("/", createSalary);
router.put("/:id", editSalary);
router.delete("/:id", softDelete);

module.exports = router;



