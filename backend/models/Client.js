const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  companyName: String,
  email: String,
  companyNumber: String,
});

module.exports = mongoose.model("Client", clientSchema);
