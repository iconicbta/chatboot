const Lead = require("../models/Lead");
const { processMessage } = require("../services/message.service");

// 1. GET = Solo verificación de Meta
const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403); // Era 200, debe ser 403 si falla
};

// 2. POST = Recibir mensajes - AQUÍ ESTÁ EL CAMBIO CLAVE
const handleIncomingMessage = (req, res) => {
  // QUITA EL ASYNC ^^^^^

  // 1. RESPONDE A META YA MISMO, antes de cualquier await
  res.sendStatus(200);

  // 2. Después procesas. No uses await aquí porque ya respondiste
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message?.text?.body) {
      // No pongas await. Deja que corra en background
      processMessage(message.text.body, message.from).catch(err => {
        console.error("Error procesando mensaje:", err);
      });
    }
  } catch (e) {
    console.error("Error en webhook:", e);
  }
};

// 3. Dashboard
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
};

module.exports = { verifyWebhook, handleIncomingMessage, getLeads };
