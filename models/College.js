const mongoose = require("mongoose");

// ──~~~~~ Sub-schemas ~~~~───────────────────────────────

const coordinatesSchema = new mongoose.Schema(
  {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    pincode: { type: String, trim: true },
    coordinates: { type: coordinatesSchema, default: () => ({}) },
  },
  { _id: false }
);

const nirfRankingSchema = new mongoose.Schema(
  {
    overallRank: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
  },
  { _id: false }
);

const ratingsSchema = new mongoose.Schema(
  {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    filename: { type: String, trim: true },     // uploaded file name on server
    originalName: { type: String, trim: true },  // original file name from client
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema(
  {
    images: { type: [imageSchema], default: [] },
    videoLink: { type: String, trim: true },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    unit: { type: String, default: "LPA" },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    companyId: { type: String, trim: true },
    companyName: { type: String, trim: true },
    logo: { type: String, trim: true },
    sector: { type: String, trim: true },
    highestPackageOffered: { type: packageSchema, default: () => ({}) },
    averagePackageOffered: { type: packageSchema, default: () => ({}) },
    medianPackageOffered: { type: packageSchema, default: () => ({}) },
  },
  { _id: false }
);

const placementSchema = new mongoose.Schema(
  {
    placementPercentage: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    highestPackage: { type: packageSchema, default: () => ({}) },
    averagePackage: { type: packageSchema, default: () => ({}) },
    medianPackage: { type: packageSchema, default: () => ({}) },
    companiesVisited: { type: [companySchema], default: [] },
  },
  { _id: false }
);

const rankRangeSchema = new mongoose.Schema(
  {
    minRank: { type: Number, default: 0 },
    maxRank: { type: Number, default: 0 },
  },
  { _id: false }
);


const rankRequiredSchema = new mongoose.Schema(
  {
    general: { type: rankRangeSchema, default: () => ({}) },
    obc: { type: rankRangeSchema, default: () => ({}) },
    sc: { type: rankRangeSchema, default: () => ({}) },
    st: { type: rankRangeSchema, default: () => ({}) },
  },
  { _id: false }
);


const feesSchema = new mongoose.Schema(
  {
    totalFees: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    yearlyFees: { type: Number, default: 0 },
  },
  { _id: false }
);


const courseSchema = new mongoose.Schema(
  {
    courseId: { type: String, trim: true },
    courseName: { type: String, trim: true },
    degreeType: { type: String, trim: true },
    durationYears: { type: Number, default: 0 },
    description: { type: String, trim: true },
    fees: { type: feesSchema, default: () => ({}) },
    seatIntake: { type: Number, default: 0 },
    rankRequired: { type: rankRequiredSchema, default: () => ({}) },
    courseRatings: { type: ratingsSchema, default: () => ({}) },
  },
  { _id: false }
);


const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, trim: true },
    userId: { type: String, trim: true },
    userName: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);



// ── Main College Schema ──────────────────────────────────

const collegeSchema = new mongoose.Schema(

  {
    collegeId: {
      type: String,
      required: [true, "College ID is required"],
      unique: true,
      trim: true,
    },
    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    establishedYear: { type: Number, default: 0 },
    description: { type: String, trim: true },
    location: { type: locationSchema, default: () => ({}) },
    nirfRanking: { type: nirfRankingSchema, default: () => ({}) },
    collegeRatings: { type: ratingsSchema, default: () => ({}) },
    media: { type: mediaSchema, default: () => ({}) },
    placement: { type: placementSchema, default: () => ({}) },
    courses: { type: [courseSchema], default: [] },
    reviews: { type: [reviewSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("College", collegeSchema);
