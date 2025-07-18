const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const customerController = require("../controllers/customerController");
const itemsRouter = express.Router();

// Middleware specific to this route
router.use((req, res, next) => {
  console.log('Customers route middleware');
  next();
});

// Get all Customers
router.get("/", authenticateToken, customerController.getCustomer);
router.get("/:id", authenticateToken, customerController.getCustomerDetail);
router.post("/", authenticateToken, customerController.addCustomers);
router.put("/:id", authenticateToken, customerController.updateCustomerData); // Update a todo by ID
router.delete("/:id", authenticateToken, customerController.deleteCustomer);

module.exports = router;