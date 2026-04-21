// src/controllers/webhook.controller.js
const { processMessage } = require("../services/message.service");
const Lead = require("../models/Lead"); // Asegúrate de que este archivo exista

const handleIncomingMessage = async (req, res) => {
  // 1. VALIDACIÓN DEL WEBHOOK (Meta envía un GET)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      console.log("✅ Webhook verificado con éxito");
      return res.status(200).send(challenge);
    } else {
      console.log("❌ Error de validación: Tokens no coinciden");
      return res.sendStatus(403);
    }
  }

  // 2. RECEPCIÓN DE MENSAJES (Meta envía un POST)
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.messages) {
      console.log("📩 Nuevo mensaje recibido");
      const message = value.messages[0];
      const senderPhone = message.from;
      const incomingMessage = message.text?.body;

      if (incomingMessage) {
        await processMessage(incomingMessage, senderPhone);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error);
    res.sendStatus(500);
  }
};

/**
 * ESTA ES LA FUNCIÓN QUE FALTABA
 */
const getLeads = async (req, res) => {
  try {
    // Buscamos todos los leads en MongoDB
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error("❌ Error al obtener leads:", error);
    res.status(500).json({ error: "Error al obtener leads" });
  }
};

// 🚩 IMPORTANTE: Exportar ambas para que el archivo de rutas las vea
module.exports = { 
  handleIncomingMessage, 
  getLeads 
};
