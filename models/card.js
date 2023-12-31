const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  cardNum: { type: String, required: true },
  expiry: { type: String, required: true },
  bankName: { type: String, required: true },
  cvv: { type: String, required: true },
  creditLimit: { type: Number, required: true },
  totalCreditLimit: { type: Number, required: true },
  user: { type: String, required: true },
  lastFiveDig: { type: String },
  orders: { type: Array, required: true },
});

module.exports = mongoose.model("Card", cardSchema);
