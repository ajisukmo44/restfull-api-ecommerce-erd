// create a handler for Admin
const  { getAllAdmin, addAdmin, deleteAdmin, getAdminById, updateAdmin }  = require("../models/admin.model.js");
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

// Validation schema for Admin
const AdminSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  username: Joi.string().required().min(0),
  password: Joi.string().required().min(6),
  role: Joi.string().required().max(100),
});

const AdminSchemaUpdate = Joi.object({
  name: Joi.string().required().min(1).max(255),
  username: Joi.string().required().min(0),
  role: Joi.string().required().max(100),
});

exports.getAdmin = async (req, res, next) => {
    // const Admin = await pool.query('SELECT * FROM Admin');
    let filteredAdmin= await getAllAdmin();
    let Admins = await getAllAdmin();
    try {
      console.log("Fetching items for Admin:", req);
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filteredAdmin = Admins.filter(Admin => searchRegex.test(Admin.name));
      }
      const output = {
        message: "List of Admin",
        data: filteredAdmin,
        count: filteredAdmin.length, 
        status: "success",
      };
      res.json(output);

    } catch (err) {
    res.status(500).json({message: err, success: false});
    }
}

exports.getAdminDetail = async (req, res, next) => {
  const id = req.params.id;
  // res.json({id, success: true});
  try {
  const Adminx = await getAdminById(id);
  const output = {
    message: "Detail of Admin",
    data: Adminx,
    status: "success",
  };
  if (Adminx) {
    res.json(output);
  } else {
    res.status(404).json({ error: "Admin not found" });
  }
} catch (err) {
  res.status(500).json({message: err, success: false});
  }
}

exports.addAdmins = async (req, res, next) => {
    try {
      // Validate request body
      const { error, value } = AdminSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          success: false
        });
      }

      const hashedPassword = await bcrypt.hash(value.password, saltRounds);

      const newAdmin = {
        name: value.name,
        username: value.username,
        role: value.role,
        password: hashedPassword,
      };

      const createdAdmin = await addAdmin(newAdmin);
      const output = {
        message: "Admin added successfully",
        data: newAdmin,
        data: {
          ...createdAdmin,
        },
        status: "success",
      };

      res.status(201).json(output);
    } catch (err) {
      console.error("Error creating Admin:", err);
 
      res.status(500).json({
        message: err.message || "Failed to create Admin item",
        success: false
      });
    }
};

exports.updateAdminData = async (req, res) => {
  const id = req.params.id;

    try {
      // Validate request body
      const { error, value } = AdminSchemaUpdate.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          success: false
        });
      }

      const updateData = {
        ...value
      };

      const updatedAdmin = await updateAdmin(id, updateData);
      
      if (!updatedAdmin) {
        return res.status(404).json({
          message: "Admin not found",
          success: false
        });
      }

      const output = {
        message: "Admin updated successfully",
        data: {
          ...updatedAdmin
        },
        status: "success",
      };

      res.json(output);
    } catch (err) {
      console.error("Error updating Admin:", err);
   
      res.status(500).json({
        message: err.message || "Failed to update Admin item",
        success: false
      });
    }
};

exports.deleteAdmin =  async (req, res, next) => {
  const idd = req.params.id;
    
  const deleteAdminx = await deleteAdmin(idd);
  const output = {
    message: "Admin deleted successfully",
    status: "success",
  };
  if (deleteAdminx) {
    res.json(output);
  } else {
    res.status(404).json({ error: "Admin not found" });
  }
};

