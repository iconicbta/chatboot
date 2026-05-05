const express = require("express");
const router = express.Router();

const {
  handleIncomingMessage,
  getLeads,
  addNote,
} = require("../controllers/webhook.controller");

// 🔥 Webhook Twilio
router.post("/", handleIncomingMessage);

// 🔥 Obtener leads
router.get("/leads", getLeads);

// 🔥 NUEVO: guardar seguimiento
router.post("/leads/:id/note", addNote);

module.exports = router;
