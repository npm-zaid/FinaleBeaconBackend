const Enquiry = require("../models/Enquiry");

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, course } = req.body;

    const enquiry = await Enquiry.create({ name, phone, email, course });

    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: enquiry,
    });
  } catch (error) {
    // Handle Mongoose validation errors
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

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Public
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get a single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Public
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update an enquiry
// @route   PUT /api/enquiries/:id
// @access  Public
exports.updateEnquiry = async (req, res) => {
  try {
    const { name, phone, email, course } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, course },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
    });
  } catch (error) {
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
        message: "Invalid enquiry ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Public
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
      data: enquiry,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
