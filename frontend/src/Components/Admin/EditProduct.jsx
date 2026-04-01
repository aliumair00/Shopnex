import React, { useState } from "react";

const EditProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    color: [],
    collection: "",
    material: "",
    gender: "",
    images: [
      {
        url: "",
      },
      {
        url: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const NewImg = e.target.files[0];
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("edited product image",productData);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 rounded-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Edit Product</h2>
      <form onSubmit={handleSubmit} className="">
        {/* Name  */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="description" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="price" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              min="0"
              step="0.01"
            />
          </div>

          {/* Count in Stock */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="countInStock" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Count in Stock
            </label>
            <input
              type="number"
              id="countInStock"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              min="0"
            />
          </div>
        </div>

        {/* SKU */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="sku" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sizes */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="sizes" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Sizes (comma separated)
            </label>
            <input
              type="text"
              id="sizes"
              name="sizes"
              value={productData.sizes.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  sizes: e.target.value.split(",").map((size) => size.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="S, M, L, XL"
            />
          </div>

          {/* Colors */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="colors" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Colors (comma separated)
            </label>
            <input
              type="text"
              id="colors"
              name="color"
              value={productData.color.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  color: e.target.value.split(",").map((color) => color.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Red, Blue, Green"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="images" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-xs sm:text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:sm:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            multiple
          />
        </div>

        {/* Image Preview */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">Image Preview</h3>
          <div className="flex flex-wrap gap-2">
            {productData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}{image.url}`}
                  alt={image.altText || "Product Image"}
                  className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedImages = [...productData.images];
                    updatedImages.splice(index, 1);
                    setProductData({...productData, images: updatedImages});
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center sm:justify-end mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-xs sm:text-sm font-medium"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
