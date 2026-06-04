const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  createNotification,
  deleteNotification,
} = require("../controllers/notificationController");

router.route("/").get(getAllNotifications).post(createNotification);
router.route("/:id").delete(deleteNotification);

module.exports = router;
