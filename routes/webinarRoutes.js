const express = require("express");
const router = express.Router();
const {
  getWebinars,
  getWebinarById,
  createWebinar,
  updateWebinar,
  deleteWebinar,
} = require("../controllers/webinarController");

router.route("/").get(getWebinars).post(createWebinar);
router.route("/:id").get(getWebinarById).put(updateWebinar).delete(deleteWebinar);

module.exports = router;
