// src/controllers/webhook.controller.js

const handleIncomingMessage = async (req, res) => {
  // 1. VALIDACIÓN DEL WEBHOOK (Meta envía un GET)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Comparamos con la variable que acabas de mostrar en la foto
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      console.log("✅ Webhook verificado con éxito");
      // CRÍTICO: Enviar el challenge como texto plano y status 200
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
      // Aquí va tu lógica de processMessage...
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error);
    res.sendStatus(500);
  }
};

module.exports = { handleIncomingMessage };
