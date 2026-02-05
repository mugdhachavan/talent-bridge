const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { uploadFiles } = require("../middleware/upload.middleware");
const profileController = require("../controllers/profile.controller");

// View own profile
router.get("/me", authMiddleware, profileController.getMyProfile);

// Update profile (text + photo + resume)
router.put("/me",authMiddleware,uploadFiles,profileController.updateMyProfile);

// Download resume
router.get("/me/resume/:id",profileController.downloadResume);

module.exports = router;
