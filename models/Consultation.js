const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    expertId: { type: String, required: true },
    expertName: { type: String },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, default: "Scheduled" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);
