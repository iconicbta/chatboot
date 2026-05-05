const express = require("express");
const router = express.Router();

const {
  handleIncomingMessage,
} = require("../controllers/webhook.controller");

// Webhook Twilio
router.post("/", handleIncomingMessage);

module.exports = router;
