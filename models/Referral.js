const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    agentName: {
      type: String,
      required: true,
      trim: true,
    },
    agentContact: {
      type: String,
      required: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentContact: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "enrolled", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
