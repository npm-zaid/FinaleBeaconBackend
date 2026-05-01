const express = require("express");
const router = express.Router();
const { createPartner, getPartners } = require("../controllers/partnerController");

router.post("/", createPartner);
router.get("/", getPartners);

module.exports = router;
