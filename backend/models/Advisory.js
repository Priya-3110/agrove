const mongoose = require("mongoose");

const advisorySchema = new mongoose.Schema({
  crop: String,
  soil: String,
  title: String,
  content: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Advisory", advisorySchema);
