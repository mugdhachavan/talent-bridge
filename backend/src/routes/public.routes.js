const express = require("express");
const router = express.Router();

const publicController = require("../controllers/public.controller");

router.get("/profiles", publicController.getPublicProfiles);
router.get("/profile/:id", publicController.getPublicProfileById);
router.get("/profile/:id/resume", publicController.downloadPublicResume);

module.exports = router;
