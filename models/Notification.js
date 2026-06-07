const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String, // E.g.,'26 FEB 2026'
    },
    category: {
      type: String,
      required: true,
    },
    source: { type: String },
    summary: { type: String },
    fullDetail: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
