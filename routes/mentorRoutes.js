const express = require("express");
const router  = express.Router();
const protectAdmin = require("../middleware/auth");
const {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  updateSlots,
} = require("../controllers/mentorController");

// Public
router.route("/").get(getMentors);
router.route("/:id").get(getMentorById);

// Admin-protected
router.route("/").post(protectAdmin, createMentor);
router.route("/:id").put(protectAdmin, updateMentor).delete(protectAdmin, deleteMentor);
router.route("/:id/slots").patch(protectAdmin, updateSlots);

module.exports = router;
