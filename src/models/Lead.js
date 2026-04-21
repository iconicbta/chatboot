const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, default: "No suministrado" },
  area: String,
  subarea: String,
  amount: String,
  description: String,
  notes: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", LeadSchema);
