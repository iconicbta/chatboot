const express = require("express");
const router = express.Router();

const {
  verifyWebhook, // Nueva función para el GET
  handleIncomingMessage, // Solo para el POST
  getLeads,
} = require("../controllers/webhook.controller");

router.get("/", verifyWebhook); // GET = solo verificar
router.post("/", handleIncomingMessage); // POST = recibir mensajes

router.get("/leads", getLeads);

module.exports = router;
