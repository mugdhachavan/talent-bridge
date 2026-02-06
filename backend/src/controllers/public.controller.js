const User = require("../models/user.model");

/**
 * GET /api/public/profiles
 * Public list of profiles (read-only)
 */
exports.getPublicProfiles = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "profilePhoto",
        "skills",
        "degree",
        "institute",
        "email",
        "graduationYear"
      ]
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/public/profile/:id
 * View individual profile (no resume)
 */
exports.getPublicProfileById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [
        "id",
        "username",
        "profilePhoto",
        "skills",
        "degree",
        "institute",
        "graduationYear",
        "resume"
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * GET /api/public/profile/:id/resume
 * Public resume view/download
 */
exports.downloadPublicResume = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    // ✅ FIX: correct field name
    const resumeFile = user?.resume || user?.resumeFile || user?.cv;

    if (!user || !resumeFile) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumePath = path.join(
      __dirname,
      "../../public/uploads/resumes",
      resumeFile
    );

    return res.download(resumePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

