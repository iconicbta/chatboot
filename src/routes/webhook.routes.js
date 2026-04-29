const express = require("express");
const router = express.Router();

const {
  verifyWebhook,
  handleIncomingMessage,
  getLeads,
} = require("../controllers/webhook.controller");

router.get("/", verifyWebhook); // Cambia esto
router.post("/", handleIncomingMessage);

router.get("/leads", getLeads);

module.exports = router;
