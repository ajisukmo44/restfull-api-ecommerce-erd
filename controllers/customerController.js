// create a handler for Customer
const  { getAllCustomer, addCustomer, deleteCustomer, getCustomerById, updateCustomer }  = require("../models/customers.model.js");
const Joi = require('joi');

// Validation schema for Customer
const CustomerSchema = Joi.object({
  customer_name: Joi.string().required().min(1).max(255),
  nomer_hp: Joi.string().required().min(8),
  status: Joi.string().required().min(1)
});

exports.getCustomer = async (req, res, next) => {
    // const Customer = await pool.query('SELECT * FROM Customer');
    let filteredCustomer= await getAllCustomer();
    let Customers = await getAllCustomer();
    try {
      console.log("Fetching items for Customer:", req);
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filteredCustomer = Customers.filter(customer => searchRegex.test(customer.customer_name));
      }
      const output = {
        message: "List of Customer",
        data: filteredCustomer,
        count: filteredCustomer.length, 
        status: "success",
      };
      res.json(output);

    } catch (err) {
    res.status(500).json({message: err, success: false});
    }
}

exports.getCustomerDetail = async (req, res, next) => {
  const id = req.params.id;
  // res.json({id, success: true});
  try {
  const Customerx = await getCustomerById(id);
  const output = {
    message: "Detail of Customer",
    data: Customerx,
    status: "success",
  };
  if (Customerx) {
    res.json(output);
  } else {
    res.status(404).json({ error: "Customer not found" });
  }
} catch (err) {
  res.status(500).json({message: err, success: false});
  }
}

exports.addCustomers = async (req, res, next) => {
    try {
      // Validate request body
      const { error, value } = CustomerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          success: false
        });
      }

      const newCustomer = {
        customer_name: value.customer_name,
        nomer_hp: value.nomer_hp,
        status: value.status,
      };

      const createdCustomer = await addCustomer(newCustomer);
      const output = {
        message: "Customer added successfully",
        data: newCustomer,
        data: {
          ...createdCustomer,
        },
        status: "success",
      };

      res.status(201).json(output);
    } catch (err) {
      console.error("Error creating Customer:", err);
    
      res.status(500).json({
        message: err.message || "Failed to create Customer item",
        success: false
      });
    }
};

exports.updateCustomerData = async (req, res) => {
  const id = req.params.id;

    try {
      // Validate request body
      const { error, value } = CustomerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          success: false
        });
      }

      const updateData = {
        ...value
      };

      const updatedCustomer = await updateCustomer(id, updateData);
      
      if (!updatedCustomer) {
        return res.status(404).json({
          message: "Customer not found",
          success: false
        });
      }

      const output = {
        message: "Customer updated successfully",
        data: {
          ...updatedCustomer
        },
        status: "success",
      };

      res.json(output);
    } catch (err) {
      console.error("Error updating Customer:", err);
   
      res.status(500).json({
        message: err.message || "Failed to update Customer item",
        success: false
      });
    }
};

exports.deleteCustomer =  async (req, res, next) => {
  const idd = req.params.id;
    
  const deleteCustomerx = await deleteCustomer(idd);
  const output = {
    message: "Customer deleted successfully",
    status: "success",
  };
  if (deleteCustomerx) {
    res.json(output);
  } else {
    res.status(404).json({ error: "Customer not found" });
  }
};

