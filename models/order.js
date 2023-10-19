const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  name: { type: String, required: true },
  orderNum: { type: String, required: true },
  orderDate: { type: String, required: true },
  cardUsed: { type: String, required: true },
  merchant: { type: String, required: true },
  user: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
