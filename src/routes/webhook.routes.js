const express = require("express");
const router = express.Router();

const {
  handleIncomingMessage,
  getLeads,
} = require("../controllers/webhook.controller");

// 🔥 Webhook Twilio
router.post("/", handleIncomingMessage);

// 🔥 Endpoint para frontend
router.get("/leads", getLeads);

module.exports = router;
