const express = require("express");
const router = express.Router();

// Importamos ambas funciones del controlador
const {
  handleIncomingMessage,
  getLeads,
} = require("../controllers/webhook.controller");

/**
 * RUTA PARA EL BOT (WhatsApp/Meta)
 * GET: Se usa para la validación inicial (el challenge)
 * POST: Se usa para recibir los mensajes reales
 */
router.get("/", handleIncomingMessage); // 🚩 ESTA ES LA QUE FALTA
router.post("/", handleIncomingMessage);

/**
 * RUTA PARA EL DASHBOARD (Frontend)
 */
router.get("/leads", getLeads);

module.exports = router;
