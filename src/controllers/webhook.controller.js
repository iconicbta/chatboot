const { processMessage } = require("../services/message.service");

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

module.exports = { handleIncomingMessage };
