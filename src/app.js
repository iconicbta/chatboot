const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const webhookRoutes = require("./routes/webhook.routes");

const app = express(); // Primero inicializamos

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use("/webhook", webhookRoutes);

module.exports = app;
