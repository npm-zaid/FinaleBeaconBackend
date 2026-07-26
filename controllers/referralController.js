const Referral = require("../models/Referral");

// @desc    Submit a new referral
// @route   POST /api/referrals
// @access  Public
exports.createReferral = async (req, res) => {
  try {
    const { agentName, agentContact, studentName, studentContact, course } = req.body;

    if (!agentName || !agentContact || !studentName || !studentContact || !course) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (agentName, agentContact, studentName, studentContact, course).",
      });
    }

    const referral = await Referral.create({
      agentName,
      agentContact,
      studentName,
      studentContact,
      course,
    });

    res.status(201).json({
      success: true,
      message: "Referral submitted successfully",
      data: referral,
    });
  } catch (error) {
    console.error("Error creating referral:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not submit referral",
    });
  }
};

// @desc    Get all referrals
// @route   GET /api/referrals
// @access  Private (Admin)
exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch referrals",
    });
  }
};

// @desc    Update referral status
// @route   PUT /api/referrals/:id/status
// @access  Private (Admin)
exports.updateReferralStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["pending", "contacted", "enrolled", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!referral) {
      return res.status(404).json({ success: false, message: "Referral not found" });
    }

    res.status(200).json({
      success: true,
      message: "Referral status updated",
      data: referral,
    });
  } catch (error) {
    console.error("Error updating referral status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not update referral status",
    });
  }
};

// @desc    Delete referral
// @route   DELETE /api/referrals/:id
// @access  Private (Admin)
exports.deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);

    if (!referral) {
      return res.status(404).json({ success: false, message: "Referral not found" });
    }

    res.status(200).json({
      success: true,
      message: "Referral deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting referral:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete referral",
    });
  }
};
