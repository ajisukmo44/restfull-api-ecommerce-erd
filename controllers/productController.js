// create a handler for Product
const  { getAllProduct, addProduct, deleteProduct, getProductById, updateProduct }  = require("../models/product.model.js");
const Joi = require('joi');

// Validation schema for Product
const ProductSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  price: Joi.number().required().min(0),
  deskripsi: Joi.string().optional().allow(''),
  category: Joi.string().required().min(1).max(100)
});

exports.getProduct = async (req, res, next) => {
    let filteredProduct = await getAllProduct();
    let Products = await getAllProduct();
    try {
      console.log("Fetching items for user:", req);
  
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filteredProduct = Products.filter(product => searchRegex.test(product.name));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      const output = {
        message: "List of Product",
        data: filteredProduct,
        count: filteredProduct.length, 
        status: "success",
      };
      res.write(JSON.stringify(output));
      res.end();

    } catch (err) {
    res.status(500).json({message: err, success: false});
    }
}

exports.getProductDetail = async (req, res, next) => {
  const id = req.params.id;
  // res.json({id, success: true});
  try {
  const Productx = await getProductById(id);
  const output = {
    message: "Detail of Product",
    data: Productx,
    status: "success",
  };
  if (Productx) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(output));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: "Product not found" }));
  }
} catch (err) {
  res.status(500).json({message: err, success: false});
  }
  res.end();
}

exports.addProducts = async (req, res, next) => {

    try {
      // Validate request body
      const { error, value } = ProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          success: false
        });
      }

      const newProduct = {
        name: value.name,
        price: value.price,
        deskripsi: value.deskripsi || '',
        category: value.category,
      };

      const createdProduct = await addProduct(newProduct);
      
      const output = {
        message: "Product added successfully",
        data: {
          ...createdProduct,
        },
        status: "success",
      };


      res.status(201).json(output);
    } catch (err) {
      console.error("Error creating Product:", err);
    
      res.status(500).json({
        message: err.message || "Failed to create Product item",
        success: false
      });
    }
};

exports.updateProductData = async (req, res) => {
  const id = req.params.id;
    try {
      // Validate request body
      const { error, value } = ProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          success: false
        });
      }
      const updateData = {
        ...value,
      };

      const updatedProduct = await updateProduct(id, updateData);
      
      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found",
          success: false
        });
      }
      const output = {
        message: "Product updated",
        data: updatedProduct,
        status: "success",
      };

      res.json(output);
    } catch (err) {
      console.error("Error updating Product:", err);
      res.status(500).json({
        message: err.message || "Failed to update Product item",
        success: false
      });
    }
};

exports.deleteProduct =  async (req, res, next) => {
    const idd = req.params.id;
    const deleteProductx = await deleteProduct(idd);
    const output = {
      message: "Product deleted successfully",
      status: "success",
    };
    if (deleteProductx) {
      res.writeHead(200, { "Content-Type": "application/json" }); // No Content
      res.write(JSON.stringify(output));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Product not found" }));
    }
    res.end();
};

