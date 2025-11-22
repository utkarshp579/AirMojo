const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticPages.js");

router.get("/about", staticController.renderAbout);
router.get("/contact", staticController.renderContact);
router.get("/services", staticController.renderServices);
router.get("/faqs", staticController.renderFAQs);
router.get("/terms", staticController.renderTerms);
router.get("/privacy", staticController.renderPrivacy);

module.exports = router;
