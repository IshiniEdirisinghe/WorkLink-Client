const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
});

module.exports = mongoose.model("Project", projectSchema);
