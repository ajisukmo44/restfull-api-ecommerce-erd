const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customers');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

// Third-party middleware
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Custom middleware
app.use(requestLogger);

// routes admin
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// routes customers
app.use('/api/customer', customerRoutes);

// routes product
app.use('/api/products', productRoutes);

// routes orders
app.use('/api/orders', ordersRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express API' });
});

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;