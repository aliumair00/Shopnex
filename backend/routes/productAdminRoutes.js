const express = require("express");
const Product = require("../models/product");
const {protect, admin} = require("../middleware/authMiddleware");
const upload = require("../Config/multer");
const router = express.Router();


const parseArrayInput = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }
  return [];
};

//@route GET /api/admin/products
//@desc Get all products (admin only)
//@access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route GET /api/admin/products
//@desc Get all products (admin only)
//@access Private/Admin
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    // Create image URLs from uploaded files
    const images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
    }));

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      productCollection: collection,
      material,
      gender,
      images, // saved image URLs
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: '686a33cbebe5fdad9bbe9eaf',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
  
  //@route PUT api/products/:id
  //@desc Update a product
  //@access Private/Admin
 router.put('/:id', protect, admin, upload.array('images'), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      collection,
      material,
      gender,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Parse arrays from either string or array input
    const sizes = parseArrayInput(req.body.sizes, product.sizes);
    const colors = parseArrayInput(req.body.colors, product.colors);
    const parsedTags = parseArrayInput(tags, product.tags);

    // Handle images (if new files uploaded)
    let updatedImages = product.images; // default to existing
    if (req.files && req.files.length > 0) {
      updatedImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        altText: `Image for ${name || product.name}`,
      }));
    }

    // Assign updated values
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.countInStock = countInStock || product.countInStock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.sizes = sizes;
    product.colors = colors;
    product.productCollection = collection || product.productCollection;
    product.material = material || product.material;
    product.gender = gender || product.gender;
    product.images = updatedImages;
    product.isFeatured = isFeatured === 'true' || isFeatured === true;
    product.isPublished = isPublished === 'true' || isPublished === true;
    product.tags = parsedTags;
    product.dimensions = dimensions || product.dimensions;
    product.weight = weight || product.weight;
    product.sku = sku || product.sku;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).send('Server Error');
  }
});


  router.delete("/:id", protect, admin, async (req, res) => {
    try {
      //find product by id
      const product = await Product.findById(req.params.id);
      if (product) {
        //delete product
        await product.deleteOne();
        res.json({ message: "Product removed" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });
module.exports = router;

//@route POST /api/admin/products
//@desc Create a new product (admin only)
//@access Private/Admin


