const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// PLACE ORDER (CHECKOUT)
router.post("/checkout", orderController.createOrder);

// GET ORDER HISTORY
router.get("/:user_id", orderController.getUserOrders);

module.exports = router;