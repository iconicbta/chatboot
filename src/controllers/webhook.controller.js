const { processMessage } = require("../services/message.service");
const Lead = require("../models/Lead"); // Importamos el modelo para poder consultar

const handleIncomingMessage = async (req, res) => {
  try {
    // 1. Verificación del webhook para Meta
    if (
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === process.env.VERIFY_TOKEN
    ) {
      console.log("✅ Webhook verificado por Meta");
      return res.send(req.query["hub.challenge"]);
    }

    // 2. Procesar mensaje entrante de WhatsApp
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.messages) {
      const message = value.messages[0];
      const senderPhone = message.from;
      const incomingMessage = message.text?.body;

      if (incomingMessage) {
        await processMessage(incomingMessage, senderPhone);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en Webhook:", error);
    res.sendStatus(500);
  }
};

/**
 * NUEVA FUNCIÓN: Obtener los leads para el Dashboard
 */
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error("❌ Error al obtener leads:", error);
    res.status(500).json({ error: "Error al obtener leads" });
  }
};

// 🚩 CORRECCIÓN CRÍTICA: Exportar AMBAS funciones
module.exports = { 
  handleIncomingMessage, 
  getLeads 
};
