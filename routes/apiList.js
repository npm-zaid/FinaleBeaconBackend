const express = require("express");
const router = express.Router();

// Complete list of all available API endpoints
const apiEndpoints = [
  {
    method: "GET",
    path: "/",
    description: "Health check — verify the server is running",
    auth: "None",
  },
  {
    method: "GET",
    path: "/api",
    description: "List all available API endpoints",
    auth: "None",
  },

  // ──────────── User (Public) ────────────
  {
    method: "POST",
    path: "/api/enquiries",
    description: "Submit a new student enquiry (public)",
    auth: "None",
    body: {
      name: "String (required, 2-100 chars)",
      phone: "String (required, exactly 10 digits)",
      email: "String (required, valid email format)",
    },
  },

  // ──────────── Admin (Auth Required) ────────────
  {
    method: "POST",
    path: "/api/admin/register",
    description: "Register a new admin account",
    auth: "None",
    body: {
      name: "String (required)",
      email: "String (required, unique)",
      password: "String (required, min 6 chars)",
    },
  },
  {
    method: "POST",
    path: "/api/admin/login",
    description: "Admin login — returns JWT token",
    auth: "None",
    body: {
      email: "String (required)",
      password: "String (required)",
    },
  },
  {
    method: "GET",
    path: "/api/admin/enquiries",
    description: "Get all student enquiries (admin only)",
    auth: "Bearer Token (JWT)",
  },
  {
    method: "GET",
    path: "/api/admin/enquiries/:id",
    description: "Get a single enquiry by ID (admin only)",
    auth: "Bearer Token (JWT)",
    params: { id: "MongoDB ObjectId" },
  },
  {
    method: "DELETE",
    path: "/api/admin/enquiries/:id",
    description: "Delete a student enquiry (admin only)",
    auth: "Bearer Token (JWT)",
    params: { id: "MongoDB ObjectId" },
  },

  // ──────────── Colleges (Public) ────────────
  {
    method: "GET",
    path: "/api/colleges",
    description: "Get all colleges with pagination, search & sort (public)",
    auth: "None",
    query: {
      page: "Number (default 1)",
      limit: "Number (default 10, max 100)",
      search: "String — searches collegeName, city, state",
      sortBy: "String — field to sort by (default createdAt)",
      order: "String — 'asc' or 'desc' (default desc)",
    },
  },

  // ──────────── College Management (Admin) ────────────
  {
    method: "POST",
    path: "/api/admin/colleges",
    description: "Add a new college with full details (admin only)",
    auth: "Bearer Token (JWT)",
    body: {
      collegeId: "String (required, unique)",
      collegeName: "String (required)",
      collegeType: "String",
      feesRange: "String",
      modes: "Array of Strings",
      establishedYear: "Number",
      description: "String",
      location: "Object { country, state, city, address, pincode, coordinates }",
      nirfRanking: "Object { overallRank, year }",
      collegeRatings: "Object { averageRating, totalReviews }",
      media: "Object { images: [{ url }], videoLink }",
      placement: "Object { placementPercentage, year, highestPackage, averagePackage, medianPackage, companiesVisited }",
      courses: "Array of course objects",
      reviews: "Array of review objects",
    },
  },
  {
    method: "GET",
    path: "/api/admin/colleges",
    description: "Get all colleges (admin only)",
    auth: "Bearer Token (JWT)",
  },
  {
    method: "GET",
    path: "/api/admin/colleges/:id",
    description: "Get a single college by ID (admin only)",
    auth: "Bearer Token (JWT)",
    params: { id: "MongoDB ObjectId" },
  },
  {
    method: "PUT",
    path: "/api/admin/colleges/:id",
    description: "Update a college (admin only)",
    auth: "Bearer Token (JWT)",
    params: { id: "MongoDB ObjectId" },
  },
  {
    method: "DELETE",
    path: "/api/admin/colleges/:id",
    description: "Delete a college (admin only)",
    auth: "Bearer Token (JWT)",
    params: { id: "MongoDB ObjectId" },
  },
  // ──────────── Webinars ────────────
  {
    method: "GET",
    path: "/api/webinars",
    description: "Get all webinars (filter by status, category, search)",
    auth: "None",
  },
  {
    method: "GET",
    path: "/api/webinars/:id",
    description: "Get webinar details by ID",
    auth: "None",
    params: { id: "MongoDB ObjectId" },
  },
  {
    method: "POST",
    path: "/api/webinars",
    description: "Create a new webinar",
    auth: "None",
    body: {
      title: "String (required)",
      name: "String (required)",
      url: "String (required)",
      status: "String ('UPCOMING' | 'LIVE' | 'RECORDED')",
      time: "String",
      viewers: "String",
      icon: "String",
      category: "String",
    },
  },
  {
    method: "PUT",
    path: "/api/webinars/:id",
    description: "Update a webinar",
    auth: "None",
    params: { id: "MongoDB ObjectId" },
  },
  {
    method: "DELETE",
    path: "/api/webinars/:id",
    description: "Delete a webinar",
    auth: "None",
    params: { id: "MongoDB ObjectId" },
  },
];

// @desc    List all available API endpoints
// @route   GET /api
// @access  Public
router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Enquiry API — Available Endpoints",
    totalEndpoints: apiEndpoints.length,
    endpoints: apiEndpoints,
  });
});

module.exports = router;
