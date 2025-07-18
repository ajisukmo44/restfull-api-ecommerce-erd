const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const adminController = require("../controllers/adminController");
const itemsRouter = express.Router();

// Middleware specific to this route
router.use((req, res, next) => {
  console.log('admins route middleware');
  next();
});

// Get all admins
router.get("/", authenticateToken, adminController.getAdmin);
router.get("/:id", authenticateToken, adminController.getAdminDetail);
router.post("/", authenticateToken, adminController.addAdmins);
router.put("/:id", authenticateToken, adminController.updateAdminData); // Update a todo by ID
router.delete("/:id", authenticateToken, adminController.deleteAdmin);

module.exports = router;