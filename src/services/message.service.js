const Lead = require("../models/Lead");

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

const processMessage = async (message, userPhone) => {
  const msg = message.trim();

  // 🔁 Reiniciar conversación
  if (msg.toLowerCase() === "reiniciar") {
    delete userState[userPhone];
    return "🔄 Conversación reiniciada. Escribe 'hola' para comenzar.";
  }

  // Inicializar usuario
  if (!userState[userPhone]) {
    userState[userPhone] = {
      step: "ASK_NAME",
      data: { phone: userPhone },
    };

    return "¡Hola! 👋 Bienvenido a Abogados DEMO.\nPor favor indícame tu nombre completo.";
  }

  const state = userState[userPhone];
  let responseText = "";

  // 1. NOMBRE
  if (state.step === "ASK_NAME") {
    if (msg.length < 3) {
      responseText = "Por favor escribe tu nombre completo.";
    } else {
      state.data.name = msg;
      state.step = "ASK_AREA";

      responseText = `Mucho gusto, ${msg} 😊\n¿En qué área legal necesitas ayuda?\n\n1. Derecho Civil\n2. Derecho Penal\n3. Derecho Laboral\n4. Derecho de Familia`;
    }
  }

  // 2. ÁREA
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

      responseText = "¿Cuál es el valor aproximado del caso? (o 0 si no aplica)";
    }
  }

  // 4. CUANTÍA
  else if (state.step === "ASK_AMOUNT") {
    if (isNaN(msg.replace(/\./g, ""))) {
      responseText = "Por favor ingresa un valor numérico.";
    } else {
      state.data.amount = msg;
      state.step = "ASK_DESCRIPTION";

      responseText = "Describe brevemente tu caso (mínimo 10 caracteres).";
    }
  }

  // 5. DESCRIPCIÓN
  else if (state.step === "ASK_DESCRIPTION") {
    if (msg.length < 10) {
      responseText = "Por favor describe un poco más tu caso.";
    } else {
      state.data.description = msg;
      state.step = "SHOW_PRICE";

      responseText = `Gracias por la información 🙌\n\nPara ${state.data.subarea}, nuestros honorarios están entre:\n$500.000 y $2.000.000.\n\n¿Deseas continuar?\n\n1. Sí\n2. Prefiero que me contacten luego`;
    }
  }

  // 6. FINAL
  else if (state.step === "SHOW_PRICE") {
    if (msg === "1" || msg === "2") {
      try {
        const newLead = new Lead({
          name: state.data.name,
          phone: state.data.phone,
          area: state.data.area,
          subarea: state.data.subarea,
          amount: state.data.amount,
          description: state.data.description,
          contactPreference: msg === "1" ? "Inmediato" : "Posterior",
        });

        await newLead.save();
        console.log("✅ Lead guardado");
      } catch (error) {
        console.error("❌ Error DB:", error);
      }

      delete userState[userPhone];

      responseText =
        msg === "1"
          ? "Perfecto 🙌 Un abogado te contactará pronto."
          : "Perfecto 👍 Te contactaremos luego.";
    } else {
      responseText = "Por favor responde con 1 o 2.";
    }
  }

  return responseText;
};

module.exports = { processMessage };
