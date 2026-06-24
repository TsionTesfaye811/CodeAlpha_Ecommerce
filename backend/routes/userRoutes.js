const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

router.get("/:id/orders", orderController.getUserOrders);
router.get("/:id", userController.getUser);

module.exports = router;
