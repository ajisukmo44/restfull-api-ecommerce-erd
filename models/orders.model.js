const express = require('express');
const pool = require('../config/pg');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const JWT_SECRET = 'your-secret-key-change-in-production';

// Order crud 
async function getAllOrder() {
  const res = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return res.rows;
};

async function addOrder(token, data) {
  const decoded = jwt.verify(token, JWT_SECRET);
  const userResult = await pool.query('SELECT * FROM admin WHERE admin_id = $1', [decoded.userId]);
  const userID = userResult.rows[0].admin_id;

  const res = await pool.query('INSERT INTO orders (admin_id, order_date, total_payment, customer_id, created_at) VALUES ($1, $2, $3, $4,  $5) RETURNING *', [userID, data.order_date, data.total_payment, data.customer_id, data.created_at]);
  return res.rows[0];
};

async function addOrderItem(data) {
  let random = (Math.random() + 1).toString(36).substring(7);
  const res = await pool.query('INSERT INTO order_details (id, order_id, product_id, price, qty, total_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [random, data.order_id, data.product_id, data.price, data.qty, data.total_price]);
  return res.rows[0];
};

async function getOrderById(id) {
  const res = await pool.query('SELECT * FROM orders WHERE order_id = $1', [id]);
  return res.rows[0];
};

async function getOrderItemByGroupId(id) {
  const res = await pool.query('SELECT ti.*, p.name, p.price FROM order_details ti JOIN product p ON ti.product_id = p.product_id  WHERE order_id = $1', [id]);
  return res.rows;
};

async function deleteOrder(id) {
  const res = await pool.query('UPDATE Order SET is_deleted = true, deleted_at = $1 WHERE id = $2 RETURNING *', [nDate, id]);
  return res.rows;
};


module.exports = { getAllOrder, addOrder, addOrderItem, deleteOrder, getOrderById, getOrderItemByGroupId};