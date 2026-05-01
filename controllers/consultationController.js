const Consultation = require("../models/Consultation");

// @route   POST /api/consultations
// @desc    Book a consultation
exports.createConsultation = async (req, res) => {
  try {
    const { expertId, expertName, email, mobile, date, timeSlot } = req.body;
    const newConsultation = new Consultation({
      expertId,
      expertName,
      email,
      mobile,
      date,
      timeSlot
    });
    await newConsultation.save();
    res.status(201).json({ success: true, data: newConsultation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   GET /api/consultations
// @desc    Get all consultations (for admin)
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
