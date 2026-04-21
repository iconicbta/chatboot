// src/test/chatSimulator.js

const readline = require("readline");
const { processMessage } = require("../services/message.service");

// Interfaz consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🤖 Bot iniciado. Escribe algo:");

rl.on("line", async (input) => {
  const response = await processMessage(input, "user1");
  console.log("Bot:", response);
});
