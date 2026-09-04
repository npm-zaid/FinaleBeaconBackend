const Webinar = require("../models/Webinar");

const INITIAL_WEBINARS = [
  {
    title: "IIT JEE 2025 Strategy",
    name: "Dr. Ramesh Kumar",
    host: "Dr. Ramesh Kumar",
    url: "https://collegy.in/webinars/iit-jee-strategy",
    status: "LIVE",
    viewers: "1.2K watching",
    time: "Live now",
    icon: "🎯",
    category: "Engineering",
    order: 1,
  },
  {
    title: "NEET Prep Masterclass",
    name: "Prof. Ananya Singh",
    host: "Prof. Ananya Singh",
    url: "https://collegy.in/webinars/neet-prep-masterclass",
    status: "UPCOMING",
    viewers: "850 registered",
    time: "Today · 5:00 PM",
    icon: "🔬",
    category: "Medical",
    order: 2,
  },
  {
    title: "College Application Tips",
    name: "Aditi Sharma",
    host: "Aditi Sharma",
    url: "https://collegy.in/webinars/college-application-tips",
    status: "UPCOMING",
    viewers: "620 registered",
    time: "Tomorrow · 3:00 PM",
    icon: "📝",
    category: "Admissions",
    order: 3,
  },
  {
    title: "Scholarship Guide 2025",
    name: "Rahul Mehta",
    host: "Rahul Mehta",
    url: "https://collegy.in/webinars/scholarship-guide-2025",
    status: "RECORDED",
    viewers: "3.4K views",
    time: "Watch anytime",
    icon: "🏆",
    category: "Scholarship",
    order: 4,
  },
  {
    title: "Engineering Career Paths",
    name: "Vikram Nair",
    host: "Vikram Nair",
    url: "https://collegy.in/webinars/engineering-career-paths",
    status: "UPCOMING",
    viewers: "530 registered",
    time: "Sat · 11:00 AM",
    icon: "⚙️",
    category: "Engineering",
    order: 5,
  },
  {
    title: "MBA Admissions 2025",
    name: "Priya Khanna",
    host: "Priya Khanna",
    url: "https://collegy.in/webinars/mba-admissions-2025",
    status: "UPCOMING",
    viewers: "920 registered",
    time: "Today · 7:00 PM",
    icon: "💼",
    category: "Management",
    order: 6,
  },
  {
    title: "CUET Strategy Session",
    name: "Dr. Suresh Iyer",
    host: "Dr. Suresh Iyer",
    url: "https://collegy.in/webinars/cuet-strategy-session",
    status: "LIVE",
    viewers: "2.1K watching",
    time: "Live now",
    icon: "📚",
    category: "Admissions",
    order: 7,
  },
  {
    title: "Study Abroad 101",
    name: "Neha Bose",
    host: "Neha Bose",
    url: "https://collegy.in/webinars/study-abroad-101",
    status: "RECORDED",
    viewers: "5.6K views",
    time: "Watch anytime",
    icon: "✈️",
    category: "Study Abroad",
    order: 8,
  },
  {
    title: "Financial Aid & Loans",
    name: "Arjun Sethi",
    host: "Arjun Sethi",
    url: "https://collegy.in/webinars/financial-aid-loans",
    status: "UPCOMING",
    viewers: "410 registered",
    time: "Sun · 4:00 PM",
    icon: "💰",
    category: "Finance",
    order: 9,
  },
  {
    title: "Law School Journey",
    name: "Kavya Menon",
    host: "Kavya Menon",
    url: "https://collegy.in/webinars/law-school-journey",
    status: "UPCOMING",
    viewers: "340 registered",
    time: "Mon · 6:00 PM",
    icon: "⚖️",
    category: "Law",
    order: 10,
  },
];

// @desc    Get all webinars (Auto-seeds if database is empty)
// @route   GET /api/webinars
// @access  Public
exports.getWebinars = async (req, res) => {
  try {
    let count = await Webinar.countDocuments();
    if (count === 0) {
      await Webinar.insertMany(INITIAL_WEBINARS);
    }

    const { status, category, search } = req.query;
    let query = { isActive: { $ne: false } };

    if (status && status !== "ALL") {
      query.status = status.toUpperCase();
    }
    if (category && category !== "All") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { host: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const webinars = await Webinar.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: webinars.length,
      data: webinars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single webinar
// @route   GET /api/webinars/:id
// @access  Public
exports.getWebinarById = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ success: false, message: "Webinar not found" });
    }
    res.status(200).json({ success: true, data: webinar });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Create a webinar
// @route   POST /api/webinars
// @access  Public / Admin
exports.createWebinar = async (req, res) => {
  try {
    const { title, name, host, url, status, time, viewers, icon, category, description, order } = req.body;

    if (!title || (!name && !host) || !url) {
      return res.status(400).json({
        success: false,
        message: "Title, Speaker Name/Host, and URL are required",
      });
    }

    const speakerName = name || host;

    const webinar = await Webinar.create({
      title,
      name: speakerName,
      host: speakerName,
      url,
      status: status || "UPCOMING",
      time: time || "Upcoming",
      viewers: viewers || "100+ registered",
      icon: icon || "🎯",
      category: category || "General",
      description: description || "",
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json({
      success: true,
      data: webinar,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create webinar",
      error: error.message,
    });
  }
};

// @desc    Update a webinar
// @route   PUT /api/webinars/:id
// @access  Public / Admin
exports.updateWebinar = async (req, res) => {
  try {
    if (req.body.name && !req.body.host) {
      req.body.host = req.body.name;
    }
    if (req.body.host && !req.body.name) {
      req.body.name = req.body.host;
    }

    const webinar = await Webinar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!webinar) {
      return res.status(404).json({ success: false, message: "Webinar not found" });
    }

    res.status(200).json({
      success: true,
      data: webinar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update webinar",
      error: error.message,
    });
  }
};

// @desc    Delete a webinar
// @route   DELETE /api/webinars/:id
// @access  Public / Admin
exports.deleteWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ success: false, message: "Webinar not found" });
    }
    await webinar.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
      message: "Webinar deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
