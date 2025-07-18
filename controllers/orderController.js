// create a handler for Order
const  { getAllOrder, addOrder, getOrderItemByGroupId, addOrderItem, getOrderById }  = require("../models/orders.model.js");
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/pg.js');

exports.getOrder = async (req, res, next) => {
    // const Order = await pool.query('SELECT * FROM Order');
    let filteredOrder = await getAllOrder();
    let Orders = await getAllOrder();
    try {
      console.log("Fetching items for user:", req);
  
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filteredOrder = Orders.filter(Order => searchRegex.test(Order.name));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      const output = {
        message: "List of Order",
        data: filteredOrder,
        count: filteredOrder.length, 
        status: "success",
      };
      res.write(JSON.stringify(output));
      res.end();

    } catch (err) {
    res.status(500).json({message: err, success: false});
    }
}

exports.getOrderDetail = async (req, res, next) => {
  const id = req.params.id;
  try {
    const OrderDetail = await getOrderById(id);
    const OrderItem = await getOrderItemByGroupId(id);
    const output = {
      message: "Detail of Order",
      data: OrderDetail,
      items: OrderItem,
      status: "success",
    };
    if (OrderDetail) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(output));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Order not found" }));
    }
  } catch (err) {
    res.status(500).json({message: err, success: false});
  }
  res.end();
}

exports.addOrders = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const dateNow = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta'
  });
  try {

   const newOrder = {
     order_date: req.body.order_date,
     customer_id: req.body.customer_id,
     total_payment: req.body.total_payment,
   };
 
   let result = await addOrder(token, newOrder); 
   
   if(result){
    const items = req.body.items;
    items.forEach(val => {
      const newOrderItem = {
        "order_id": result?.order_id,
        "product_id": val.product_id,
        "price" : val.price,
        "qty": val.qty,
        "total_price": val.total_price
      };
      return addOrderItemRun(newOrderItem);  
    });
   }      

   
   const OrderItem = await getOrderItemByGroupId(result?.order_id);
  
   const output = {
     message: "Order added successfully",
     data: result,
    //  dataItem: OrderItem,
     status: "success",
   };

   res.writeHead(200, { "Content-Type": "application/json" });
   res.write(JSON.stringify(output));
  } catch (err) {
   console.error("Error creating Order:", err);
   res.status(500).json({
     message: err.message || "Failed to create Order item",
     success: false
   });
  }
  res.end();
 }

 const addOrderItemRun =  async (data) => {
  if(data){
    await addOrderItem(data); 
  }
};

exports.deleteOrder =  async (req, res, next) => {
  // const idd = req.params.id;
    
  // const deleteOrderx = await deleteOrder(idd);
  // const output = {
  //   message: "Order deleted successfully",
  //   status: "success",
  // };
  // if (deleteOrderx) {
  //   res.writeHead(200, { "Content-Type": "application/json" }); // No Content
  //   res.write(JSON.stringify(output));
  // } else {
  //   res.writeHead(404, { "Content-Type": "application/json" });
  //   res.write(JSON.stringify({ error: "Order not found" }));
  // }
  // res.end();
};

exports.updateOrderData = async (req, res) => {
 //
};

