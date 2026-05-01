const Partner = require("../models/Partner");

// @route   POST /api/partners
// @desc    Submit a partner application
exports.createPartner = async (req, res) => {
  try {
    const { fullName, email, companyName, experience, studentVolume } = req.body;
    const newPartner = new Partner({
      fullName,
      email,
      companyName,
      experience,
      studentVolume
    });
    await newPartner.save();
    res.status(201).json({ success: true, data: newPartner });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   GET /api/partners
// @desc    Get all partners (for admin)
exports.getPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
