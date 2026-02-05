const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (data) => {
  const existingUser = await User.findOne({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    skills: data.skills,
    degree: data.degree,
    institute: data.institute,
    graduationYear: data.graduationYear,
    profilePhoto: data.profilePhoto,
    resume: data.resume
  });
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Login successful",
    token
  };
};
