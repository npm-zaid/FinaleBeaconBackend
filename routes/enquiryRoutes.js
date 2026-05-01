const express = require("express");
const router = express.Router();
const { createEnquiry } = require("../controllers/enquiryController");

// ----- User (Public) routes — no login required -----

// @desc    Submit a new enquiry
// @route   POST /api/enquiries
router.post("/", createEnquiry);

module.exports = router;
