const Lead = require("../models/Lead");

// 🔥 TWILIO WEBHOOK
const handleIncomingMessage = (req, res) => {
  const mensaje = req.body.Body;
  const from = req.body.From;

  console.log("Mensaje recibido:", mensaje);
  console.log("De:", from);

  // Respuesta en formato XML (OBLIGATORIO para Twilio)
  const response = `
    <Response>
      <Message>Hola, recibí: ${mensaje}</Message>
    </Response>
  `;

  res.set("Content-Type", "text/xml");
  res.send(response);
};

// Dashboard (lo dejamos igual)
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
};

module.exports = { handleIncomingMessage, getLeads };
