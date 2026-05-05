const { processMessage } = require("../services/message.service");
const Lead = require("../models/Lead");

// 🔥 WEBHOOK TWILIO
const handleIncomingMessage = async (req, res) => {
  try {
    const mensaje = req.body.Body;
    const from = req.body.From;

    console.log("Mensaje recibido:", mensaje);
    console.log("De:", from);

    const respuesta = await processMessage(mensaje, from);

    res.set("Content-Type", "text/xml");
    res.send(`
      <Response>
        <Message>${respuesta}</Message>
      </Response>
    `);
  } catch (error) {
    console.error("❌ Error en webhook:", error);

    res.set("Content-Type", "text/xml");
    res.send(`
      <Response>
        <Message>Ocurrió un error, intenta nuevamente.</Message>
      </Response>
    `);
  }
};

// 🔥 ENDPOINT PARA FRONTEND (LEADS)
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error("❌ Error obteniendo leads:", error);
    res.status(500).json({ error: "Error obteniendo leads" });
  }
};

module.exports = { handleIncomingMessage, getLeads };
