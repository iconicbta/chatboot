const Lead = require("../models/Lead");
const axios = require("axios");

const userState = {};

const AREAS = {
  1: "Derecho Civil",
  2: "Derecho Penal",
  3: "Derecho Laboral",
  4: "Derecho de Familia",
};

const SUBAREAS = {
  1: [
    "Contratos",
    "Cobro de deudas",
    "Propiedad de inmuebles",
    "Responsabilidad civil",
  ],
  2: ["Denuncia", "Defensa", "Capturas", "Estafas"],
  3: ["Despido", "Acoso laboral", "Pensión", "Contratos"],
  4: ["Divorcio", "Cuota alimentaria", "Sucesiones", "Custodia"],
};

/**
 * FUNCIÓN PARA ENVIAR MENSAJES A WHATSAPP CLOUD API
 */
const sendWhatsAppMessage = async (toNumber, messageText) => {
  // 1. IGNORAR MENSAJES DE PRUEBA DE META
  if (toNumber.startsWith('34021')) {
    console.log(`🧪 Mensaje de prueba de Meta ignorado para ${toNumber}`);
    return;
  }

  // 2. DEBUG: VER QUÉ VALORES ESTÁ USANDO
  console.log('🔍 DEBUG - Phone ID:', process.env.WA_PHONE_NUMBER_ID);
  console.log('🔍 DEBUG - Token existe:',!!process.env.WA_TOKEN);
  console.log('🔍 DEBUG - Enviando a:', toNumber);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: toNumber,
        type: "text",
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WA_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log(`➡️ Mensaje enviado a ${toNumber} | ID: ${response.data.messages[0].id}`);
  } catch (error) {
    console.error(
      "❌ Error enviando a Meta:",
      error.response?.data || error.message,
    );
    // ESTO TE DICE SI EL TOKEN O PHONE_ID ESTÁN MAL
  }
};

/**
 * LÓGICA PRINCIPAL DEL CHATBOT
 */
const processMessage = async (message, userPhone) => {
  const msg = message.trim();

  // 🔁 Reiniciar conversación
  if (msg.toLowerCase() === "reiniciar") {
    delete userState[userPhone];
    const restartMsg =
      "🔄 Conversación reiniciada. Escribe 'hola' para comenzar.";
    await sendWhatsAppMessage(userPhone, restartMsg);
    return;
  }

  // Inicializar usuario si no existe
  if (!userState[userPhone]) {
    userState[userPhone] = {
      step: "ASK_NAME",
      data: { phone: userPhone },
    };
    const welcomeMsg =
      "¡Hola! 👋 Bienvenido a Abogados DEMO.\nPor favor indícame tu nombre completo.";
    await sendWhatsAppMessage(userPhone, welcomeMsg);
    return;
  }

  const state = userState[userPhone];
  let responseText = "";

  // 1. CAPTURA NOMBRE
  if (state.step === "ASK_NAME") {
    if (msg.length < 3) {
      responseText = "Por favor escribe tu nombre completo.";
    } else {
      state.data.name = msg;
      state.step = "ASK_AREA";
      responseText = `Mucho gusto, ${msg} 😊\n¿En qué área legal necesitas ayuda?\n\n1. Derecho Civil\n2. Derecho Penal\n3. Derecho Laboral\n4. Derecho de Familia`;
    }
  }

  // 2. ÁREA LEGAL
  else if (state.step === "ASK_AREA") {
    if (!AREAS[msg]) {
      responseText = "No te entendí 😅 por favor elige una opción del 1 al 4.";
    } else {
      state.data.area = AREAS[msg];
      state.data.areaKey = msg;
      state.step = "ASK_SUBAREA";
      const options = SUBAREAS[msg]
      .map((item, i) => `${i + 1}. ${item}`)
      .join("\n");
      responseText = `Seleccionaste ${AREAS[msg]}.\n¿Qué tipo de proceso necesitas?\n${options}`;
    }
  }

  // 3. SUBÁREA
  else if (state.step === "ASK_SUBAREA") {
    const subList = SUBAREAS[state.data.areaKey];
    const index = parseInt(msg) - 1;
    if (!subList[index]) {
      responseText = "No te entendí 😅 elige una opción válida.";
    } else {
      state.data.subarea = subList[index];
      state.step = "ASK_AMOUNT";
      responseText =
        "¿Cuál es el valor aproximado del caso? (Si no aplica escribe 0)";
    }
  }

  // 4. CUANTÍA
  else if (state.step === "ASK_AMOUNT") {
    if (isNaN(msg.replace(/\./g, ""))) {
      responseText = "Por favor ingresa un valor numérico (o 0 si no aplica).";
    } else {
      state.data.amount = msg;
      state.step = "ASK_DESCRIPTION";
      responseText = "Describe brevemente tu caso (máx 300 caracteres).";
    }
  }

  // 5. DESCRIPCIÓN
  else if (state.step === "ASK_DESCRIPTION") {
    if (msg.length < 10) {
      responseText = "Por favor describe un poco más tu caso.";
    } else {
      state.data.description = msg;
      state.step = "SHOW_PRICE";
      responseText = `Gracias por la información 🙌\n\nPara ${state.data.subarea}, nuestros honorarios están entre:\n$500.000 y $2.000.000.\n\n¿Deseas continuar?\n\n1. Sí, hablar con abogado\n2. Prefiero que me contacten luego`;
    }
  }

  // 6. CIERRE Y GUARDADO EN DB
  else if (state.step === "SHOW_PRICE") {
    if (msg === "1" || msg === "2") {
      state.step = "END";
      try {
        const newLead = new Lead({
          name: state.data.name,
          phone: state.data.phone,
          area: state.data.area,
          subarea: state.data.subarea,
          amount: state.data.amount,
          description: state.data.description,
          contactPreference: msg === "1"? "Inmediato" : "Posterior",
        });
        await newLead.save();
        console.log("✅ Lead guardado exitosamente");
      } catch (error) {
        console.error("❌ Error al guardar en DB:", error);
      }

      responseText =
        msg === "1"
        ? `Perfecto ${state.data.name} 🙌 Enviamos tu caso al área de ${state.data.area}. Un asesor te contactará pronto.`
          : `Perfecto ${state.data.name} 👍 Hemos registrado tu solicitud para contacto posterior.`;

      delete userState[userPhone]; // Finalizamos el estado
    } else {
      responseText = "Por favor responde con 1 o 2.";
    }
  } else {
    responseText =
      "Proceso finalizado. Escribe 'reiniciar' para comenzar nuevamente.";
  }

  // ENVIAR LA RESPUESTA FINAL
  await sendWhatsAppMessage(userPhone, responseText);
};

module.exports = { processMessage };
