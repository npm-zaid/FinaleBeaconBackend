const express = require("express");
const router  = express.Router();
const protectAdmin = require("../middleware/auth");
const {
  bookSession,
  getSessions,
  getSessionById,
  updateStatus,
} = require("../controllers/sessionController");

// Public: students book
router.route("/").post(bookSession);

// Admin-protected: list all sessions
router.route("/").get(protectAdmin, getSessions);
router.route("/:id").get(protectAdmin, getSessionById);
router.route("/:id/status").patch(protectAdmin, updateStatus);

module.exports = router;
