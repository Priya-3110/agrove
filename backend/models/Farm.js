const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
          },
    name: String,
    area: Number,
    crop: String,
    soil: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Farm", farmSchema);
