const User = require("../models/user.model");

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    console.log("REQ.USER 👉", req.user);

    const userId = req.user.id || req.user.userId;

    const user = await User.findOne({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    await user.update(req.body);

    res.json({
      message: "Profile updated successfully",
      data: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const newUser = req.params.id
    const user = await User.findByPk(newUser);
    
    if (!user || !user.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.download(user.resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};