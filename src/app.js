const express = require("express");
const cors = require("cors");
require("dotenv").config();

const webhookRoutes = require("./routes/webhook.routes");

const app = express();

app.use(cors());

// 🔥 Express nativo (mejor que body-parser)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use("/webhook", webhookRoutes);

module.exports = app;
