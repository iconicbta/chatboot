// src/server.js
const app = require("./app");
const connectDB = require("./config/db");

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// Función de arranque
const startServer = async () => {
  try {
    // 1. Intentamos conectar a MongoDB Atlas
    await connectDB();

    // 2. Levantamos el servidor solo si la BD conectó
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error(
      "No se pudo iniciar el servidor debido a un error en la BD:",
      error,
    );
  }
};

startServer();
