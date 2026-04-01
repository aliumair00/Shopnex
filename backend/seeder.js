const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");
const products = require("./data/products");
const User = require("./models/User");
const Cart = require("./models/cart");

dotenv.config();

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

//function to seed products
const seedData = async () => {
  try {
    //clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    //create a default admin user
    const createUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "8130000",
      role: "admin",
    });
    // Assign the default user ID to each product
    const userID = createUser._id;

    const sampleData = products.map((product) => {
      return { 
        ...product, 
        user: userID,
        productCollection: product.collection // Map collection to productCollection
      };
    });
    // Insert the product into the database
    await Product.insertMany(sampleData);
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
