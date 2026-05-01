const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    stream: { type: String, required: true },
    fullName: { type: String, required: true },
    skill: { type: String, required: true },
    portfolio: { type: String, required: true },
    projectDescription: { type: String, required: true },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
