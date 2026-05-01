const express = require("express");
const router = express.Router();
const { createConsultation, getConsultations } = require("../controllers/consultationController");

router.post("/", createConsultation);
router.get("/", getConsultations);

module.exports = router;
