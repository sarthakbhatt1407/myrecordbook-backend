const express = require("express");
const router = express.Router();
const usersController = require("../controller/userController");
const cardController = require("../controller/cardController");
// User Controls
router.post("/sign-up", usersController.userSignUp);

// Card Controls
router.post("/add-new-card", cardController.addNewCard);
router.post("/card-limit-updater", cardController.cardLimitUpdater);
router.post("/delete-card", cardController.deleteCardById);
router.get("/all-cards", cardController.getAllCards);
router.get("/card/:id", cardController.getCardById);

// Order Contorls

module.exports = router;
