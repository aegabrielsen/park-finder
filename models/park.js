const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parkSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Park", parkSchema);
