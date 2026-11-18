const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mentor name is required"],
      trim: true,
    },
    college: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    campus: {
      type: String,
      default: "India",
      trim: true,
    },
    year: {
      type: String,
      default: "2nd Year",
      trim: true,
    },
    languages: {
      type: [String],
      default: ["English", "Hindi"],
    },
    expertise: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      default: "",
      trim: true,
    },
    quote: {
      type: String,
      default: "",
      trim: true,
    },
    price15: {
      type: Number,
      default: 59,
    },
    price30: {
      type: Number,
      default: 99,
    },
    // Array of ISO date-time strings for available slots
    slots: {
      type: [String],
      default: [],
    },
    // Gradient tone for the cover card
    tone: {
      type: String,
      default: "from-[#2667ff] to-[#3f8efc]",
    },
    // Cloudinary URLs
    photo: { type: String, default: null },
    cover: { type: String, default: null },
    logo:  { type: String, default: null },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);
