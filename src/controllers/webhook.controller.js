const Lead = require("../models/Lead");
const { processMessage } = require("../services/message.service");

// 1. Manejador para WhatsApp (Validación GET y Mensajes POST)
const handleIncomingMessage = async (req, res) => {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(200);
  }

  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message?.text?.body) {
      await processMessage(message.text.body, message.from);
    }
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
};

// 2. Manejador para el Dashboard (Listado de clientes)
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
};

// EXPORTACIÓN ÚNICA (Asegúrate de que estas líneas estén al final)
module.exports = { handleIncomingMessage, getLeads };
