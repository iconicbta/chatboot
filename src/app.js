const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const webhookRoutes = require("./routes/webhook.routes");

const app = express();

app.use(cors());

// 🔥 IMPORTANTE PARA TWILIO
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas
app.use("/webhook", webhookRoutes);

module.exports = app;
