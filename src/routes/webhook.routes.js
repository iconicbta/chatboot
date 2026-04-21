const express = require("express");
const router = express.Router();

// Importamos ambas funciones del controlador
const {
  handleIncomingMessage,
  getLeads,
} = require("../controllers/webhook.controller");

/**
 * RUTA PARA EL BOT (WhatsApp/Twilio)
 * Recibe los mensajes entrantes de los clientes
 */
router.post("/", handleIncomingMessage);

/**
 * RUTA PARA EL DASHBOARD (Frontend)
 * Obtiene el listado de todos los prospectos desde MongoDB
 */
router.get("/leads", getLeads);

module.exports = router;
