const express = require("express");
const router = express.Router();
const { getAllCollegesPublic } = require("../controllers/collegeController");

// @route   GET /api/colleges?page=1&limit=10&search=mumbai&sortBy=collegeName&order=asc
// @access  Public
router.get("/", getAllCollegesPublic);

module.exports = router;
