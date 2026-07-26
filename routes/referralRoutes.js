const express = require("express");
const router = express.Router();
const {
  createReferral,
  getReferrals,
  updateReferralStatus,
  deleteReferral,
} = require("../controllers/referralController");

router.route("/").post(createReferral).get(getReferrals);
router.route("/:id/status").put(updateReferralStatus);
router.route("/:id").delete(deleteReferral);

module.exports = router;
