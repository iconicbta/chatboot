const express = require("express");
const router = express.Router();

const {
  handleIncomingMessage,
  getLeads,
} = require("../controllers/webhook.controller");

// Twilio usa POST
router.post("/", handleIncomingMessage);

// Opcional dashboard
router.get("/leads", getLeads);

module.exports = router;
