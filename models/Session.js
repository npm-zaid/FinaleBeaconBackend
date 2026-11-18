const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: [true, "Mentor reference is required"],
    },
    // Keep a snapshot of mentor name so we don't need a populate on every list
    mentorName: { type: String, default: "" },

    slot: {
      type: String,
      required: [true, "Slot (ISO date-time) is required"],
    },
    duration: {
      type: Number,
      enum: [15, 30],
      required: [true, "Duration (15 or 30 min) is required"],
    },
    price: {
      type: Number,
      required: true,
    },

    // Student details
    studentName:  { type: String, required: [true, "Student name is required"], trim: true },
    studentEmail: { type: String, required: [true, "Student email is required"], trim: true, lowercase: true },
    studentPhone: { type: String, default: "" },

    // Google Meet link generated at booking time
    meetLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
