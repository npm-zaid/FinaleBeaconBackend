const Internship = require("../models/Internship");

// @route   POST /api/internships
// @desc    Submit an internship application
exports.createInternship = async (req, res) => {
  try {
    const { stream, fullName, skill, portfolio, projectDescription } = req.body;
    const newInternship = new Internship({
      stream,
      fullName,
      skill,
      portfolio,
      projectDescription
    });
    await newInternship.save();
    res.status(201).json({ success: true, data: newInternship });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// @route   GET /api/internships
// @desc    Get all internships (for admin)
exports.getInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: internships });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


