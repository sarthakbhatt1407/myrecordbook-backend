const express = require("express");
const router = express.Router();
const usersController = require("../controller/userController");
const cardController = require("../controller/cardController");
const orderController = require("../controller/orderController");
// User Controls
router.post("/sign-up", usersController.userSignUp);
router.post("/login", usersController.userLogin);

// Card Controls
router.post("/add-new-card", cardController.addNewCard);
router.post("/card-limit-updater", cardController.cardLimitUpdater);
router.delete("/delete-card", cardController.deleteCardById);
router.get("/all-cards", cardController.getAllCards);
router.post("/all-cards", cardController.getAllCardsOfUser);
router.get("/card/:id", cardController.getCardById);
router.post("/card/:id/edit", cardController.cardEditor);

// Order Contorls

router.post("/add-new-order", orderController.addNewOrder);
router.delete("/delete-order", orderController.orderDeleter);
router.post("/all-orders", orderController.getAllOrderOfUser);
router.get("/order/:orderId", orderController.getOrderByOrderId);
router.patch("/order/edit", orderController.orderUpdater);

module.exports = router;
