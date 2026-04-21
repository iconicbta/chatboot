const { processMessage } = require("../services/message.service");

const handleIncomingMessage = async (req, res) => {
  try {
    // Verificación del webhook
    if (
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === process.env.VERIFY_TOKEN
    ) {
      return res.send(req.query["hub.challenge"]);
    }

    // Procesar mensaje entrante
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
    console.error("Error en Webhook:", error);
    res.sendStatus(500);
  }
};

module.exports = { handleIncomingMessage };
