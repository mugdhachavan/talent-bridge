const authService = require("../services/auth.service");

//signup user
exports.signup = async (req, res) => {
  try {
    const user = await authService.signup({
      ...req.body,
      profilePhoto: req.files?.profilePhoto?.[0]?.path,
      resume: req.files?.resume?.[0]?.path
    });

    return res.status(201).json({
      message: "Signup successful",
      userId: user.id
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || "Signup failed"
    });
  }
};


// Login user
exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// Logout user
exports.logout = (req, res) => {
  // If you are storing JWT in cookies
  res.clearCookie('token'); // optional, only if using cookies

  // Response
  res.status(200).json({ message: "Logged out successfully" });
};
