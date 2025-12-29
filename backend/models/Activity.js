const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    type: String,
    date: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
