const { processMessage } = require("../services/message.service");

const handleIncomingMessage = async (req, res) => {
  const mensaje = req.body.Body;
  const from = req.body.From;

  console.log("Mensaje:", mensaje);

  // 👇 aquí llamas tu lógica
  const respuesta = await processMessage(mensaje, from);

  // 👇 Twilio responde con XML
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Message>${respuesta}</Message>
    </Response>
  `);
};

module.exports = { handleIncomingMessage, getLeads };
