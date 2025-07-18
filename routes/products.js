const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const productController = require("../controllers/productController");
const itemsRouter = express.Router();

// Middleware specific to this route
router.use((req, res, next) => {
  console.log('product route middleware');
  next();
});

// Crud master products
router.get("/", authenticateToken, productController.getProduct);
router.get("/:id", authenticateToken, productController.getProductDetail);
router.post("/", authenticateToken, productController.addProducts);
router.put("/:id", authenticateToken, productController.updateProductData); // Update a todo by ID
router.delete("/:id", authenticateToken, productController.deleteProduct);

module.exports = router;