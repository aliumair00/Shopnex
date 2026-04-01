const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const path = require("path");
// Load env vars
dotenv.config();

// Debug environment variables
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET exists:", process.env.JWT_SECRET ? "Yes" : "No");

const app = express();
// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the ShopNex");
});

// Api Routesconst path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoutes);

//Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

// Only listen if not in production (for local development)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
