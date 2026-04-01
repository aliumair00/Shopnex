const express = require("express");
const Checkout = require("../models/checkOut");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
//@route POST/api/checkout
//@desc Create a new checkout session
//@access Private
router.post("/", protect, async (req, res) => {
  try {
    console.log('check out data')
    console.log("Checkout Request Body:", req.body);

    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    // Validate required fields
    if (!checkoutItems || !Array.isArray(checkoutItems) || checkoutItems.length === 0) {
      return res.status(400).json({ message: "Valid checkout items are required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Valid total price is required" });
    }

    // Validate shipping address fields
    const requiredAddressFields = ['address', 'city', 'postalCode', 'country'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ message: `Shipping address ${field} is required` });
      }
    }

    // Get cart to get product IDs
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Map checkout items with product IDs from cart
    const mappedCheckoutItems = checkoutItems.map(item => {
      const cartItem = cart.products.find(p => 
        p.name === item.name && 
        p.price === item.price
      );

      if (!cartItem) {
        throw new Error(`Product not found in cart: ${item.name}`);
      }

      return {
        productId: cartItem.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      };
    });

    // create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: mappedCheckoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      orderDate: new Date()
    });

    console.log(`Checkout created successfully for user ${req.user._id}`);
    
    res.status(201).json({
      success: true,
      message: "Checkout created successfully",
      data: newCheckout
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create checkout",
      error: error.message 
    });
  }
});

//@route PUT /api/checkout/:id/pay
//@desc Update checkout session to mark as paid
//@access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error updating checkout session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route POST /api/checkout/:id/complete
//@desc finalize checkout and convert to an order after payment is successful
//@access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      //Create final order based on the checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      //mark the checkout as finalized
      checkout.isFinalized = true;
      //record the time
      checkout.finalizedAt = Date.now();
      await checkout.save();

      //delete the user cart to clean up
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "checkout is not paid" });
    }
  } catch (error) {
    console.error("Error finalizing checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
