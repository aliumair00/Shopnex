const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get the cart
const getCart = async (userId, guestId) => {
  console.log('getCart - Params:', { userId, guestId });
  
  let cart = null;
  if (userId) {
    cart = await Cart.findOne({ user: userId });
    console.log('getCart - Found user cart:', cart ? 'Yes' : 'No');
  } else if (guestId) {
    cart = await Cart.findOne({ guestId: guestId });
    console.log('getCart - Found guest cart:', cart ? 'Yes' : 'No');
  }
  
  return cart;
};

// @route POST /api/cart
// @desc Add product to the cart for a guest or logged in user
// @access Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  const parsedQuantity = Number(quantity);

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Determine the user is logged in or not
    let cart = await getCart(userId, guestId);

    if (cart) {
      // ✅ If cart exists, try updating it
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex !== -1) {
        // Product already in cart — increase quantity
        cart.products[productIndex].quantity += parsedQuantity;
      } else {
        // Product not in cart — add it
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url, // ✅ Corrected from `image` to `images`
          price: product.price,
          size,
          color,
          quantity: parsedQuantity,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // ✅ Creating a new cart
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity: parsedQuantity,
          },
        ],
        totalPrice: product.price * parsedQuantity,
      });

      return res.status(200).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest or logged in user
// @access Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  const parsedQuantity = Number(quantity);
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // update quantity
      cart.products[productIndex].quantity = parsedQuantity;
      // Optionally, remove the product if quantity is set to 0
      if (parsedQuantity === 0) {
        cart.products.splice(productIndex, 1);
      }
      cart.totalPrice = cart.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route route Delete /api/cart
//@desc remove a product from the cart
//@access Public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  console.log('DELETE /api/cart - Request body:', req.body);
  
  try {
    let cart = await getCart(userId, guestId);
    
    if (!cart) {
      console.log('DELETE /api/cart - Cart not found for:', { userId, guestId });
      return res.status(404).json({ message: "Cart not found" });
    }
    
    console.log('DELETE /api/cart - Found cart:', { 
      cartId: cart._id, 
      productCount: cart.products.length,
      userId: cart.user,
      guestId: cart.guestId
    });
    
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    
    console.log('DELETE /api/cart - Product index in cart:', productIndex);
    
    if (productIndex > -1) {
      // Store product info for logging before removing
      const removedProduct = cart.products[productIndex];
      
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      
      await cart.save();
      console.log('DELETE /api/cart - Product removed successfully:', { 
        productId: removedProduct.productId,
        name: removedProduct.name,
        remainingProducts: cart.products.length 
      });
      
      return res.status(200).json(cart);
    } else {
      console.log('DELETE /api/cart - Product not found in cart:', { productId, size, color });
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error('DELETE /api/cart - Error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

//@route GET /api/cart
//@desc get logged in user's or guest user's cart
//@access Public
router.get("/", async (req, res) => {
  const { guestId, userId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route POST /api/cart/merge
//@desc merge guest cart with logged in user's cart
//@access Public
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    const guestCart = await Cart.findOne({ guestId: guestId });
    if (!guestCart)
      return res.status(404).json({ message: "Guest cart not found" });
    const userCart = await getCart(req.user ? req.user._id : null, null);
    if (guestCart) {
      if (
        !Array.isArray(guestCart.products) ||
        guestCart.products.length === 0
      ) {
        return res.status(400).json({ message: "Guest cart is empty" });
      }
      if (userCart) {
        //merge guest cart into user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (productIndex > -1) {
            // if the user cart already has the item, update the quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            //if the user cart does not have the item, add it to the user cart
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        await userCart.save();

        //remove guest cart after merging
        try {
          await Cart.deleteOne({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart", error);
        }
        return res.status(200).json(userCart);
      } else {
        // if the user has not existing cart, assign the guest cart to the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        //guest cart has already been merged, return user cart
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: " Guest Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
