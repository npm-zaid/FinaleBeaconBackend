const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Middleware to protect admin-only routes
const protectAdmin = async (req, res, next) => {
  console.log("🔍 [auth.js] protectAdmin called");
  console.log("Authorization header:", req.headers.authorization);
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided",
    });
  }

  try {
    // Verify token
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET is not defined in environment variables!");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin to request
    req.admin = await Admin.findById(decoded.id);

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — admin not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — invalid token",
    });
  }
};

module.exports = protectAdmin;
