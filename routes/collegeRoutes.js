const express = require("express");
const router = express.Router();
const protectAdmin = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  addCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} = require("../controllers/collegeController");


// All college routes are admin-protected
// POST & PUT use multer to accept image file uploads (field name: "images")
router.post("/", protectAdmin, upload.array("images", 10), addCollege);
router.get("/", protectAdmin, getAllColleges);
router.get("/:id", protectAdmin, getCollegeById);
router.put("/:id", protectAdmin, upload.array("images", 10), updateCollege);
router.delete("/:id", protectAdmin, deleteCollege);

module.exports = router;
