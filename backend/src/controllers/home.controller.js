const User = require("../models/user.model");

/**
 * GET /api/home/profiles
 * List all user profiles
 */
exports.getAllProfiles = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "profilePhoto",
        "skills",
        "degree",
        "institute"
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
 * GET /api/home/profile/:id
 * View full profile of a user
 */
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }
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
 * GET /api/home/search?query=
 * Search by username or skill
 */
exports.searchProfiles = async (req, res) => {
  try {
    const { query } = req.query;

    const users = await User.findAll({
      where: {
        [require("sequelize").Op.or]: [
          { username: { [require("sequelize").Op.like]: `%${query}%` } },
          { skills: { [require("sequelize").Op.like]: `%${query}%` } }
        ]
      },
      attributes: [
        "id",
        "username",
        "profilePhoto",
        "skills",
        "degree"
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
