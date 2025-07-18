const express = require('express');
const pool = require('../config/pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Jakarta'
});

const JWT_SECRET = 'your-secret-key-change-in-production';

// admin crud 
async function getAllAdmin() {
  const res = await pool.query('SELECT * FROM admin');
  return res.rows;
};

async function addAdmin(data) {
  const res = await pool.query('INSERT INTO admin (name, username, role, password) VALUES ($1, $2, $3, $4) RETURNING *', [data.name, data.username, data.role, data.password]);
  return res.rows[0];
};

async function getAdminById (id) {
  const res = await pool.query('SELECT * FROM admin WHERE admin_id = $1', [id]);
  return res.rows[0];
};

async function updateAdmin(id, admin){
  let query = 'UPDATE admin SET ';
  let values = [];
  let paramCount = 1;
  
  
  query += `name = $${paramCount}, username = $${paramCount + 1}, role = $${paramCount + 2} WHERE admin_id = $${paramCount + 3} RETURNING *`;
  values.push(admin.name, admin.username, admin.role, id);
  
  const res = await pool.query(query, values);
  return res.rows[0];
};

async function deleteAdmin(id){
  const res = await pool.query('DELETE FROM admin WHERE admin_id = $1 RETURNING *', [id]);
  return res.rows;
};

module.exports = { getAllAdmin, addAdmin, deleteAdmin, getAdminById, updateAdmin };