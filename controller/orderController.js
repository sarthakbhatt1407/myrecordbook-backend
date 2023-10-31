const Order = require("../models/order");
const Card = require("../models/card");

const addNewOrder = async (req, res) => {
  const { name, orderNum, orderDate, cardUsed, merchant, user, orderAmount } =
    req.body;
  const orderChecker = await Order.findOne({ orderNum: orderNum });
  if (orderChecker) {
    return res.status(400).json({ message: "Order already exists !" });
  }
  let createdOrder = new Order({
    name,
    orderNum,
    orderDate,
    cardUsed,
    merchant,
    user,
    status: "pending",
    orderAmount,
  });
  try {
    await createdOrder.save();
  } catch (err) {
    return res.status(403).json({ message: "Unable to add order." });
  }
  const cardFound = await Card.findOne({ lastFiveDig: cardUsed });
  if (cardFound) {
    const obj = {
      name: name,
      orderNum: orderNum,
      orderAmount: orderAmount,
      id: createdOrder._id,
      orderDate: orderDate,
      merchant: merchant,
      status: "pending",
    };
    const updatedArray = cardFound.orders;
    const updatedCreditLimit = cardFound.creditLimit - orderAmount;
    updatedArray.unshift(obj);
    cardFound.orders = updatedArray;
    cardFound.creditLimit = updatedCreditLimit;
    try {
      await cardFound.save();
    } catch (err) {
      return res.status(403).json({ message: "Unable to add order to card." });
    }
  }
  return res.status(200).json({ message: "Order added successfully !" });
};

const orderDeleter = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(403).json({ message: "No order found !" });
  }
  const card = await Card.findOne({ lastFiveDig: order.cardUsed });
  if (card) {
    let updatedArray = card.orders;
    if (order.status == "pending") {
      let updatedCreditLimit = card.creditLimit;
      updatedCreditLimit += order.orderAmount;
      card.creditLimit = updatedCreditLimit;
    }
    updatedArray = card.orders.filter((ord) => {
      return ord.id != orderId;
    });
    card.orders = updatedArray;
  }
  try {
    await card.save();
    await order.deleteOne();
  } catch (err) {
    return res.status(403).json({ message: "Something went wrong ..." });
  }
  return res.json({ message: "Order deleted successfully." });
};

const getOrderByOrderId = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(403).json({ message: "No order found !" });
  }
  return res.status(200).json({ order });
};
const getAllOrderOfUser = async (req, res) => {
  const { user } = req.body;
  let orders = await Order.find({ user: user });
  if (!orders) {
    return res.status(403).json({ message: "No orders found !" });
  }
  orders = orders.map((ord) => {
    return ord.toObject({ getters: true });
  });
  return res.status(200).json({ orders });
};

const orderUpdater = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(403).json({ message: "No order found !" });
  }
  let updatedStatus = order.status;
  if (updatedStatus === "pending") {
    updatedStatus = "delivered";
  } else {
    updatedStatus = "pending";
  }
  order.status = updatedStatus;
  const card = await Card.findOne({ lastFiveDig: order.cardUsed });
  let updatedArray = card.orders;
  updatedArray = updatedArray.map((ord) => {
    if (ord.id == orderId) {
      const obj = { ...ord, status: "delivered" };
      return obj;
    }
    return ord;
  });
  console.log(updatedArray);
  card.orders = updatedArray;
  try {
    await order.save();
    await card.save();
  } catch (err) {
    return res.status(403).json({ message: "Unable to update order." });
  }

  return res.status(200).json({ message: "Order updated successfully !" });
};

exports.addNewOrder = addNewOrder;
exports.orderDeleter = orderDeleter;
exports.getOrderByOrderId = getOrderByOrderId;
exports.getAllOrderOfUser = getAllOrderOfUser;
exports.orderUpdater = orderUpdater;
