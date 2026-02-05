const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const homeController = require("../controllers/home.controller");

router.get("/profiles", authMiddleware, homeController.getAllProfiles);
router.get("/profile/:id", authMiddleware, homeController.getProfileById);
router.get("/search", authMiddleware, homeController.searchProfiles);

module.exports = router;
