const Session = require("../models/Session");
const Mentor  = require("../models/Mentor");

// ─── deterministic meet-link from mentorId + slot ────────────────────────────
function generateMeetLink(mentorId, slot) {
  const raw = `${mentorId}-${slot}`;
  // Simple base36 hash — no crypto needed
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  const abs  = Math.abs(hash).toString(36).padStart(10, "0");
  const part = [abs.slice(0, 3), abs.slice(3, 7), abs.slice(7, 10)].join("-");
  return `https://meet.google.com/${part}`;
}

// ─── POST  /api/sessions  (book a session) ───────────────────────────────────
exports.bookSession = async (req, res) => {
  try {
    const { mentorId, slot, duration, studentName, studentEmail, studentPhone } = req.body;

    if (!mentorId || !slot || !duration || !studentName || !studentEmail) {
      return res.status(400).json({
        success: false,
        message: "mentorId, slot, duration, studentName, studentEmail are required",
      });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    const dur   = Number(duration);
    const price = dur === 15 ? mentor.price15 : mentor.price30;

    // Remove the booked slot so it can't be double-booked
    mentor.slots = mentor.slots.filter((s) => s !== slot);
    await mentor.save();

    const meetLink = generateMeetLink(mentorId, slot);

    const session = await Session.create({
      mentor:       mentor._id,
      mentorName:   mentor.name,
      slot,
      duration:     dur,
      price,
      studentName,
      studentEmail,
      studentPhone: studentPhone || "",
      meetLink,
      status:       "confirmed",
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to book session", error: error.message });
  }
};

// ─── GET  /api/sessions  (admin: list all sessions) ─────────────────────────
exports.getSessions = async (req, res) => {
  try {
    const { mentorId, status } = req.query;
    let query = {};
    if (mentorId) query.mentor = mentorId;
    if (status)   query.status = status;

    const sessions = await Session.find(query)
      .populate("mentor", "name college campus photo")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─── GET  /api/sessions/:id  ─────────────────────────────────────────────────
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("mentor", "name college photo");
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─── PATCH  /api/sessions/:id/status  (admin) ────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update session", error: error.message });
  }
};
