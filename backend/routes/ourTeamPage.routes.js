const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const uploadTeam = uploadMiddleware.uploadTeam;

// ================= CONTROLLER =================
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/ourTeamPage.controller");

// ================= ROUTES =================

// GET ALL
router.get("/", getAll);

// GET ONE
router.get("/:id", getOne);

// CREATE
router.post("/", authMiddleware, uploadTeam.single("member_photo"), create);

// UPDATE
router.put("/:id", authMiddleware, uploadTeam.single("member_photo"), update);

// DELETE
router.delete("/:id", authMiddleware, remove);

module.exports = router;
