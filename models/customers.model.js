const express = require('express');
const pool = require('../config/pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Jakarta'
});

const JWT_SECRET = 'your-secret-key-change-in-production';

// customers crud 
async function getAllCustomer() {
  const res = await pool.query('SELECT * FROM customers');
  return res.rows;
};

async function addCustomer(data) {
  const res = await pool.query('INSERT INTO customers (customer_name, nomer_hp, status) VALUES ($1, $2, $3) RETURNING *', [data.customer_name, data.nomer_hp, data.status]);
  return res.rows[0];
};

async function getCustomerById (id) {
  const res = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);
  return res.rows[0];
};

async function updateCustomer(id, customers){
  let query = 'UPDATE customers SET ';
  let values = [];
  let paramCount = 1;
  
  query += `customer_name = $${paramCount}, nomer_hp = $${paramCount + 1}, status = $${paramCount + 2}  WHERE customer_id = $${paramCount + 3} RETURNING *`;
  values.push(customers.customer_name, customers.nomer_hp, customers.status, id);
  
  const res = await pool.query(query, values);
  return res.rows[0];
};

async function deleteCustomer(id){
  const res = await pool.query('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [id]);
  return res.rows;
};

module.exports = { getAllCustomer, addCustomer, deleteCustomer, getCustomerById, updateCustomer };