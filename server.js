require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.use("/api", require("./routes/apiList"));
app.use("/api/enquiries", require("./routes/enquiryRoutes"));
app.use("/api/colleges", require("./routes/publicCollegeRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/colleges", require("./routes/collegeRoutes"));
app.use("/api/partners", require("./routes/partnerRoutes"));
app.use("/api/internships", require("./routes/internshipRoutes"));
app.use("/api/consultations", require("./routes/consultationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/referrals", require("./routes/referralRoutes"));

// Health-check route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Student Enquiry API is running 🚀",
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
