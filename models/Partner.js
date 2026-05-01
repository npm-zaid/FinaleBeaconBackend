const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    experience: { type: String, required: true },
    studentVolume: { type: String, required: true },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
