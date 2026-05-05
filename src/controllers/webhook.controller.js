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

// 🔥 GET LEADS (frontend)
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error("❌ Error obteniendo leads:", error);
    res.status(500).json({ error: "Error obteniendo leads" });
  }
};

// 🔥 NUEVO: AGREGAR NOTA (LO QUE TE FALTABA)
const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, date } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        $push: {
          notes: { text, date },
        },
      },
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    console.error("❌ Error agregando nota:", error);
    res.status(500).json({ error: "Error agregando nota" });
  }
};

module.exports = { handleIncomingMessage, getLeads, addNote };
