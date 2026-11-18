const Mentor = require("../models/Mentor");

// ─── helpers ─────────────────────────────────────────────────────────────────
const TONES = [
  "from-fuchsia-600 via-purple-600 to-orange-500",
  "from-emerald-700 via-emerald-600 to-teal-500",
  "from-sky-400 via-sky-300 to-zinc-200",
  "from-orange-500 via-amber-500 to-zinc-800",
  "from-zinc-500 via-zinc-400 to-red-300",
  "from-blue-700 via-blue-600 to-sky-500",
];
const pickTone = (i) => TONES[i % TONES.length];

// Seed data so the app works immediately on a fresh DB
const SEED_MENTORS = [
  {
    name: "Sharaj R Shetty", college: "Intellipaat School of Technology",
    campus: "Bangalore, Karnataka", expertise: ["Campus Life", "Internship"],
    year: "2nd Year", price15: 59, price30: 99,
    tone: "from-fuchsia-600 via-purple-600 to-orange-500",
    about: "Hi, I'm Sharaj. I guide students through campus life and internship hunting with real talk.",
    quote: "I still remember being clueless on day one, now I help others skip that phase",
    slots: [],
  },
  {
    name: "Vidhu Mahajan", college: "Scaler School of Technology",
    campus: "Bangalore, Karnataka", expertise: ["Campus Life", "Academic Life"],
    year: "2nd Year", price15: 59, price30: 99,
    tone: "from-emerald-700 via-emerald-600 to-teal-500",
    about: "Hi, I'm Vidhu. Helping students navigate academics and campus culture at Scaler.",
    quote: "Every question you have, I had it too — let's figure it out together.",
    slots: [],
  },
  {
    name: "Laksh Bethariya", college: "Veloces Campus",
    campus: "Pune, Maharashtra", expertise: ["Academic Life", "Campus Life"],
    year: "3rd Year", price15: 59, price30: 99,
    tone: "from-sky-400 via-sky-300 to-zinc-200", slots: [],
    about: "Third year at Veloces — ask me anything about surviving engineering.",
    quote: "Show up consistently and you'll surprise yourself.",
  },
];

// ─── GET  /api/mentors  ───────────────────────────────────────────────────────
exports.getMentors = async (req, res) => {
  try {
    let count = await Mentor.countDocuments();
    if (count === 0) {
      await Mentor.insertMany(SEED_MENTORS);
    }

    const { college, campus, expertise, search } = req.query;
    let query = { isActive: { $ne: false } };

    if (college)   query.college  = { $regex: college,  $options: "i" };
    if (campus)    query.campus   = { $regex: campus,   $options: "i" };
    if (expertise) query.expertise = { $in: [new RegExp(expertise, "i")] };
    if (search)    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { college: { $regex: search, $options: "i" } },
    ];

    const mentors = await Mentor.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: mentors.length, data: mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─── GET  /api/mentors/:id  ──────────────────────────────────────────────────
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });
    res.status(200).json({ success: true, data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─── POST  /api/mentors  (admin) ─────────────────────────────────────────────
exports.createMentor = async (req, res) => {
  try {
    const {
      name, college, campus, year, languages, expertise,
      about, quote, price15, price30, slots, tone,
      photo, cover, logo,
    } = req.body;

    if (!name || !college) {
      return res.status(400).json({ success: false, message: "name and college are required" });
    }

    const count = await Mentor.countDocuments();
    const mentor = await Mentor.create({
      name, college,
      campus: campus || "India",
      year: year || "2nd Year",
      languages: languages || ["English", "Hindi"],
      expertise: expertise || [],
      about: about || `Hi, I'm ${name}. I'm here to help you navigate college life with honest advice.`,
      quote: quote || "Every question you have, I had it too — let's figure it out together.",
      price15: price15 !== undefined ? Number(price15) : 59,
      price30: price30 !== undefined ? Number(price30) : 99,
      slots: slots || [],
      tone: tone || pickTone(count),
      photo: photo || null,
      cover: cover || null,
      logo:  logo  || null,
    });

    res.status(201).json({ success: true, data: mentor });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create mentor", error: error.message });
  }
};

// ─── PUT  /api/mentors/:id  (admin) ──────────────────────────────────────────
exports.updateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });
    res.status(200).json({ success: true, data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update mentor", error: error.message });
  }
};

// ─── DELETE  /api/mentors/:id  (admin) ───────────────────────────────────────
exports.deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });
    await mentor.deleteOne();
    res.status(200).json({ success: true, data: {}, message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ─── PATCH  /api/mentors/:id/slots  (admin: set available slots) ─────────────
exports.updateSlots = async (req, res) => {
  try {
    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      return res.status(400).json({ success: false, message: "slots must be an array" });
    }
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { slots },
      { new: true }
    );
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });
    res.status(200).json({ success: true, data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
