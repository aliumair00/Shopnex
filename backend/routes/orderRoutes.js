const express = require("express");
const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/orders/my-orders
//@desc get logged-in user's orders
//@access Private
router.get("/my-orders", protect, async (req, res) => {
    try{
        //Find order for the authenticated user
        const orders = await Order.find({user: req.user._id}).sort({createdAt: -1}); //sort by most recent orders
        res.status(200).json(orders);
    }catch(error){
        console.error("Error fetching orders:", error);
        res.status(500).json({message: "Server error"});
    }
});


//@route Get /api/orders/:id
//@desc get order details  by ID
//@access Private
router.get("/:id", protect, async (req, res) => {
    try{
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if(!order){
            return res.status(404).json({message: "Order not found"});
        }
        // return the full order details
        res.status(200).json(order);
    }catch(error){
        console.error("Error fetching order details:", error);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;
