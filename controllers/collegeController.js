const fs = require("fs");
const path = require("path");
const College = require("../models/College");

// Helper: build image objects from uploaded files
const buildImageArray = (files) => {
  if (!files || files.length === 0) return [];

  return files.map((file) => ({
    filename: file.path, // Cloudinary URL
    originalName: file.originalname,
  }));
};

// Helper: delete uploaded files (No-op for Cloudinary, can be implemented later)
const deleteFiles = (filenames) => {
  // cloudinary.uploader.destroy() logic would go here
};

// Helper: parse JSON fields that arrive as strings in multipart/form-data
const parseJsonField = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

// @desc    Add a new college
// @route   POST /api/admin/colleges
// @access  Private (Admin)
// @note    Uses multipart/form-data — images uploaded as files, other data as fields
exports.addCollege = async (req, res) => {
  try {
    // Parse JSON fields that come as strings in form-data
    const body = { ...req.body };
    const jsonFields = [
      "location",
      "nirfRanking",
      "collegeRatings",
      "placement",
      "courses",
      "reviews",
      "modes",
      "exams",
    ];
    jsonFields.forEach((field) => {
      if (body[field]) {
        body[field] = parseJsonField(body[field]);
      }
    });

    // Check for duplicate collegeId
    const existing = await College.findOne({ collegeId: body.collegeId });
    if (existing) {
      // Clean up uploaded files since we won't save them
      if (req.files && req.files.length > 0) {
        deleteFiles(req.files.map((f) => f.filename));
      }
      return res.status(400).json({
        success: false,
        message: `College with ID "${body.collegeId}" already exists`,
      });
    }

    // Build media object with uploaded images + video link
    const images = buildImageArray(req.files);
    body.media = {
      images,
      videoLink: body.videoLink || "",
    };

    // Clean up helper fields
    delete body.videoLink;

    const college = await College.create(body);

    res.status(201).json({
      success: true,
      message: "College added successfully",
      data: college,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      deleteFiles(req.files.map((f) => f.filename));
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// @desc    Get all colleges with pagination (public)
// @route   GET /api/colleges
// @access  Public
// @query   page (default 1), limit (default 10), search, sortBy (default createdAt)
exports.getAllCollegesPublic = async (req, res) => {
  try {
    // Pagination params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // Search filter (searches collegeName, city, state)
    const search = req.query.search ? req.query.search.trim() : "";
    const filter = search
      ? {
        $or: [
          { collegeName: { $regex: search, $options: "i" } },
          { "location.city": { $regex: search, $options: "i" } },
          { "location.state": { $regex: search, $options: "i" } },
        ],
      }
      : {};

    // Sort
    const sortField = req.query.sortBy || "nirfRanking.overallRank";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    // Run count + data queries in parallel
    const [totalColleges, colleges] = await Promise.all([
      College.countDocuments(filter),
      College.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalColleges / limit);

    res.status(200).json({
      success: true,
      count: colleges.length,
      pagination: {
        totalColleges,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: colleges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// @desc    Get all colleges
// @route   GET /api/admin/colleges
// @access  Private (Admin)
exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get a single college by ID
// @route   GET /api/admin/colleges/:id
// @access  Private (Admin)
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update a college
// @route   PUT /api/admin/colleges/:id
// @access  Private (Admin)
// @note    Uses multipart/form-data — new images uploaded as files
exports.updateCollege = async (req, res) => {
  try {
    const existingCollege = await College.findById(req.params.id);

    if (!existingCollege) {
      // Clean up any uploaded files
      if (req.files && req.files.length > 0) {
        deleteFiles(req.files.map((f) => f.filename));
      }
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Parse JSON fields
    const body = { ...req.body };
    const jsonFields = [
      "location",
      "nirfRanking",
      "collegeRatings",
      "placement",
      "courses",
      "reviews",
      "modes",
      "exams",
    ];
    jsonFields.forEach((field) => {
      if (body[field]) {
        body[field] = parseJsonField(body[field]);
      }
    });

    // Handle images: if new files are uploaded, replace old images
    if (req.files && req.files.length > 0) {
      // Delete old images from disk
      const oldFilenames = (existingCollege.media?.images || [])
        .map((img) => img.filename)
        .filter(Boolean);
      deleteFiles(oldFilenames);

      // Build new image array
      const images = buildImageArray(req.files);
      body.media = {
        images,
        videoLink: body.videoLink || existingCollege.media?.videoLink || "",
      };
    } else if (body.videoLink !== undefined) {
      // Only video link updated, keep existing images
      body.media = {
        images: existingCollege.media?.images || [],
        videoLink: body.videoLink,
      };
    }

    // Clean up helper fields
    delete body.videoLink;

    const college = await College.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: college,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      deleteFiles(req.files.map((f) => f.filename));
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete a college
// @route   DELETE /api/admin/colleges/:id
// @access  Private (Admin)
exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Delete associated images from disk
    const filenames = (college.media?.images || [])
      .map((img) => img.filename)
      .filter(Boolean);
    deleteFiles(filenames);

    res.status(200).json({
      success: true,
      message: "College deleted successfully",
      data: college,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
