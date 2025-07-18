const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const orderController = require("../controllers/orderController");
const itemsRouter = express.Router();

// Middleware specific to this route
router.use((req, res, next) => {
  console.log('Product route middleware');
  next();
});

// Crud Transaction Order
router.get("/", authenticateToken, orderController.getOrder);
router.get("/:id", authenticateToken, orderController.getOrderDetail);
router.post("/", authenticateToken, orderController.addOrders);
router.put("/:id", authenticateToken, orderController.updateOrderData);
router.delete("/:id", authenticateToken, orderController.deleteOrder);

module.exports = router;