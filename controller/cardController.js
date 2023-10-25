const Card = require("../models/card");

const addNewCard = async (req, res) => {
  const { cardNum, expiry, bankName, cvv, creditLimit, user } = req.body;
  const cardChecker = await Card.findOne({ cardNum: cardNum });

  if (cardChecker) {
    const sameUser = await Card.findOne({ cardNum: cardNum, user: user });
    if (sameUser) {
      return res.status(400).json({ msg: "Card already exists!" });
    }
  }
  if (cardNum.length != 16) {
    return res.status(400).json({ msg: "Invalid Card number!" });
  }

  let lastFiveDig = "";
  for (let i = cardNum.length - 5; i < cardNum.length; i++) {
    lastFiveDig += cardNum[i];
    if (lastFiveDig.length === 5) {
      break;
    }
  }

  const createdCard = new Card({
    cardNum,
    expiry,
    bankName,
    cvv,
    creditLimit,
    totalCreditLimit: creditLimit,
    user,
    lastFiveDig: lastFiveDig,
    orders: [],
  });
  try {
    await createdCard.save();
  } catch (err) {
    return res.status(403).json({ message: "Unable to add card." });
  }
  return res.status(201).json({ createdCard });
};

const cardLimitUpdater = async (req, res) => {
  const { amount, lastFiveDig, task } = req.body;
  let card = await Card.findOne({ lastFiveDig: lastFiveDig });
  if (!card) {
    return res.status(400).json({ message: "Card not found!" });
  }
  let cardCreditLimit = card.creditLimit;
  let cardUpdatedCreditLimit;
  if (task === "paid") {
    cardUpdatedCreditLimit = cardCreditLimit + amount;
  }
  if (task === "used") {
    cardUpdatedCreditLimit = cardCreditLimit - amount;
  }
  card.creditLimit = cardUpdatedCreditLimit;
  try {
    await card.save();
  } catch (err) {
    return res.status(403).json({ message: "Something went wrong." });
  }
  return res.status(200).json({ card });
};

const deleteCardById = async (req, res) => {
  const { id } = req.body;
  let card = await Card.findById(id);
  if (!card) {
    return res.status(400).json({ message: "Card not found !" });
  }
  try {
    await card.deleteOne();
  } catch (err) {
    return res.status(403).json({ message: "Something went wrong." });
  }
  return res.status(200).json({ message: "Card deleted." });
};

const getCardById = async (req, res) => {
  const id = req.params.id;

  let card = await Card.findById(id);
  if (!card) {
    return res.status(400).json({ message: "Card not found !" });
  }
  return res.status(200).json({ card });
};
const getAllCards = async (req, res) => {
  let cards = await Card.find({});
  cards = cards.map((card) => {
    return card.toObject({ getters: true });
  });
  res.status(200).json({ cards });
};

const cardEditor = async (req, res) => {
  const { expiry, bankName, cvv, creditLimit } = req.body;
  const id = req.params.id;
  let lastFiveDig = "";
  let card = await Card.findById(id);
  if (!card) {
    return res.status(400).json({ message: "Card not found !" });
  }
  card.expiry = expiry;
  card.bankName = bankName;
  card.cvv = cvv;
  card.creditLimit = creditLimit;
  card.lastFiveDig = lastFiveDig;
  try {
    await card.save();
  } catch (err) {
    return res.status(403).json({ message: "Unable to update." });
  }
  return res.status(201).json({ message: "Card updated successfully." });
};

const getAllCardsOfUser = async (req, res) => {
  const { userId } = req.body;

  let cards = await Card.find({ user: userId });
  cards = cards.map((card) => {
    return card.toObject({ getters: true });
  });
  if (!cards) {
    return res.status(400).json({ message: "Unable to find cards !" });
  }
  return res.status(200).json({ cards });
};

exports.addNewCard = addNewCard;
exports.cardLimitUpdater = cardLimitUpdater;
exports.deleteCardById = deleteCardById;
exports.getAllCards = getAllCards;
exports.getCardById = getCardById;
exports.cardEditor = cardEditor;
exports.getAllCardsOfUser = getAllCardsOfUser;
