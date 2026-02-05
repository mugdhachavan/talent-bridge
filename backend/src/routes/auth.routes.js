const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { uploadFiles } = require("../middleware/upload.middleware");

// Signup
router.post("/signup", uploadFiles, authController.signup);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

module.exports = router;
