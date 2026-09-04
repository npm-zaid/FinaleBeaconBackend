const mongoose = require("mongoose");

const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a webinar title"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide speaker / host name"],
      trim: true,
    },
    host: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Please provide webinar URL"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "RECORDED"],
      default: "UPCOMING",
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    time: {
      type: String,
      default: "Upcoming",
      trim: true,
    },
    viewers: {
      type: String,
      default: "500+ registered",
      trim: true,
    },
    icon: {
      type: String,
      default: "🎯",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook: sync host with name if host is not provided
webinarSchema.pre("save", function () {
  if (!this.host && this.name) {
    this.host = this.name;
  }
  if (!this.name && this.host) {
    this.name = this.host;
  }
});

module.exports = mongoose.model("Webinar", webinarSchema);
