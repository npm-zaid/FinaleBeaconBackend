const express = require("express");
const router = express.Router();
const protectAdmin = require("../middleware/auth");
const {
  registerAdmin,
  loginAdmin,
  getAllEnquiries,
  getEnquiryById,
  deleteEnquiry,
} = require("../controllers/adminController");

// ----- Public routes (no auth) -----
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ----- Protected routes (admin auth required) -----
router.get("/enquiries", protectAdmin, getAllEnquiries);
router.get("/enquiries/:id", protectAdmin, getEnquiryById);
router.delete("/enquiries/:id", protectAdmin, deleteEnquiry);

module.exports = router;
