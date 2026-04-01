const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/User");
const {protect, admin} = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/admin/dashboard
//@desc Get dashboard statistics (admin only)
//@access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        // Get total revenue
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        
        // Get total orders count
        const totalOrders = orders.length;
        
        // Get total products count
        const totalProducts = await Product.countDocuments();
        
        // Get total users count
        const totalUsers = await User.countDocuments();
        
        // Get recent orders
        const recentOrders = await Order.find({})
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json({
            totalRevenue,
            totalOrders,
            totalProducts,
            totalUsers,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({message: "Server error"});
        console.error("Error fetching dashboard data:", error);
    }
});

module.exports = router;