const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  text: String,
  date: String,
});

const LeadSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, default: "No suministrado" },
  area: String,
  subarea: String,
  amount: String,
  description: String,

  // 🔥 mejor estructurado
  notes: {
    type: [NoteSchema],
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", LeadSchema);
