import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAdminProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../../redux/slice/adminProductSlice";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.adminProducts);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
const [imageFiles, setImageFiles] = useState([]);
const handleImageFilesChange = (e) => {
  const files = Array.from(e.target.files);
  setImageFiles(files);
};

  // Separate state for image URLs as text
  const [imageUrls, setImageUrls] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collection: "",
    material: "",
    gender: "",
    images: [],
    isFeatured: false,
    isPublished: false,
    tags: [],
    dimensions: "",
    weight: "",
    sku: "",
  });

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      countInStock: product.countInStock,
      category: product.category,
      brand: product.brand,
      sizes: product.sizes,
      colors: product.colors,
      collection: product.collection,
      material: product.material,
      gender: product.gender,
      images: product.images,
      isFeatured: product.isFeatured,
      isPublished: product.isPublished,
      tags: product.tags,
      dimensions: product.dimensions,
      weight: product.weight,
      sku: product.sku,
    });
    // Set the image URLs as text for editing
    setImageUrls(product.images?.map(img => img.url || img).join("\n") || "");
    setIsEditing(true);
    setShowAddEditModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      countInStock: 0,
      category: "",
      brand: "",
      sizes: [],
      colors: [],
      collection: "",
      material: "",
      gender: "",
      images: [],
      isFeatured: false,
      isPublished: false,
      tags: [],
      dimensions: "",
      weight: "",
      sku: "",
    });
    setImageUrls("");
    setShowAddEditModal(true);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formPayload = new FormData();

    // Append scalar fields
    const scalarFields = [
      "name", "description", "price", "discountPrice",
      "countInStock", "category", "brand", "collection",
      "material", "gender", "dimensions", "weight", "sku",
    ];
    scalarFields.forEach(field => {
      formPayload.append(field, formData[field] ?? "");
    });

    // Append boolean fields
    formPayload.append("isFeatured", formData.isFeatured);
    formPayload.append("isPublished", formData.isPublished);

    // Append array fields properly
    const arrayFields = ["sizes", "colors", "tags"];
    arrayFields.forEach(field => {
      (formData[field] || []).forEach(item => {
        formPayload.append(field, item);
      });
    });

    // Append uploaded image files
    imageFiles.forEach(file => {
      formPayload.append("images", file);
    });

    // Optionally append existing image URLs (if editing and no new upload)
    if (imageFiles.length === 0 && imageUrls.trim()) {
      const urls = imageUrls.split("\n").map(url => url.trim()).filter(Boolean);
      urls.forEach(url => {
        formPayload.append("images", JSON.stringify({ url }));
      });
    }

    if (isEditing) {
      await dispatch(updateProduct({
        id: selectedProduct._id,
        productData: formPayload,
        isFormData: true,
      }));
    } else {
      await dispatch(createProduct(formPayload));
    }

    dispatch(fetchAdminProducts());
    setShowAddEditModal(false);
    setFormData({
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      countInStock: 0,
      category: "",
      brand: "",
      sizes: [],
      colors: [],
      collection: "",
      material: "",
      gender: "",
      images: [],
      isFeatured: false,
      isPublished: false,
      tags: [],
      dimensions: "",
      weight: "",
      sku: "",
    });
    setImageFiles([]);
    setIsEditing(false);
  } catch (error) {
    console.error("Submit Error:", error);
  }
};



  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await dispatch(deleteProduct(selectedProduct._id));
        // Fetch updated product list
        dispatch(fetchAdminProducts());
        setShowDeleteModal(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image URL changes
  const handleImageUrlChange = (e) => {
    setImageUrls(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-0 text-center sm:text-left text-gray-800">Product Management</h2>
        <button
          onClick={handleAddNew}
          className="bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-green-600 transition-colors w-full sm:w-auto justify-center"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Mobile view - card layout */}
          <div className="block sm:hidden">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm mb-3 p-3 border-l-4 border-blue-500">
                  <h3 className="font-medium text-gray-900 mb-2 truncate">{product.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <p><span className="font-medium">Price:</span> PKR {product.price}</p>
                    <p><span className="font-medium">Stock:</span> {product.countInStock}</p>
                    <p><span className="font-medium">Category:</span> {product.category}</p>
                    <p><span className="font-medium">Brand:</span> {product.brand || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="bg-blue-100 text-blue-600 p-1.5 rounded hover:bg-blue-200 transition-colors"
                        title="View Details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-yellow-100 text-yellow-600 p-1.5 rounded hover:bg-yellow-200 transition-colors"
                        title="Edit Product"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="bg-red-100 text-red-600 p-1.5 rounded hover:bg-red-200 transition-colors"
                        title="Delete Product"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No products found.
              </div>
            )}
          </div>
          
          {/* Desktop view - table layout */}
          <div className="hidden sm:block overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full text-left text-gray-500">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Name</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Price</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Stock</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Category</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3 sm:py-3 sm:px-4 font-medium text-gray-900 text-sm max-w-[150px] md:max-w-[250px] truncate">
                        {product.name}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm">PKR {product.price}</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm">{product.countInStock}</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm">{product.category}</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-yellow-500 hover:text-yellow-700 p-1"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* View Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-[#0000006e] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold truncate pr-2">{selectedProduct.name}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl p-1"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Basic Information</h4>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">Price:</span> PKR {selectedProduct.price}</p>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">Discount Price:</span> PKR {selectedProduct.discountPrice}</p>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">SKU:</span> {selectedProduct.sku}</p>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">Stock:</span> {selectedProduct.countInStock}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Product Details</h4>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">Brand:</span> {selectedProduct.brand}</p>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">Collection:</span> {selectedProduct.collection}</p>
                <p className="text-xs sm:text-sm mb-1"><span className="font-medium">Gender:</span> {selectedProduct.gender}</p>
              </div>
              <div className="col-span-1 sm:col-span-2 mt-2">
                <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Description</h4>
                <p className="text-xs sm:text-sm">{selectedProduct.description}</p>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Sizes</h4>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {selectedProduct.sizes?.map((size, index) => (
                    <span key={index} className="px-2 py-0.5 sm:py-1 bg-gray-100 rounded text-xs sm:text-sm">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Colors</h4>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {selectedProduct.colors?.map((color, index) => (
                    <span key={index} className="px-2 py-0.5 sm:py-1 bg-gray-100 rounded text-xs sm:text-sm">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2 mt-2">
                <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-1 sm:mt-2">
                  {selectedProduct.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url?.startsWith("http") ? image.url : `${API_URL}${image?.url}`}
                      alt={image.altText || `Product image ${index + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-[#0000006e] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Confirm Deletion</h3>
            <p className="mb-4 text-sm sm:text-base">Are you sure you want to delete {selectedProduct.name}?</p>
            <div className="flex justify-end gap-2 sm:gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-[#0000006e] flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white p-3 sm:p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl p-1"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Basic Information */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">SKU</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows="5"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Pricing */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2 mt-3 sm:mt-4 text-sm sm:text-base">Pricing</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Price (PKR)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Discount Price (PKR)</label>
                      <input
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) => handleInputChange('discountPrice', parseFloat(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2 mt-3 sm:mt-4 text-sm sm:text-base">Inventory</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Count In Stock</label>
                      <input
                        type="number"
                        value={formData.countInStock}
                        onChange={(e) => handleInputChange('countInStock', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories and Details */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2 mt-3 sm:mt-4 text-sm sm:text-base">Categories and Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Brand</label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Collection</label>
                      <input
                        type="text"
                        value={formData.collection}
                        onChange={(e) => handleInputChange('collection', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Material</label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => handleInputChange('material', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sizes and Colors */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2 mt-3 sm:mt-4 text-sm sm:text-base">Sizes and Colors</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Sizes (comma separated)</label>
                      <input
                        type="text"
                        value={formData.sizes.join(", ")}
                        onChange={(e) => handleInputChange('sizes', e.target.value.split(",").map(item => item.trim()))}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Colors (comma separated)</label>
                      <input
                        type="text"
                        value={formData.colors.join(", ")}
                        onChange={(e) => handleInputChange('colors', e.target.value.split(",").map(item => item.trim()))}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Red, Blue, Green"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2 mt-3 sm:mt-4 text-sm sm:text-base">Images</h4>
                 
                
               <input
  type="file"
  multiple
  accept="image/*"
  className="mt-1 block w-full rounded-md border border-gray-300 p-1.5 sm:p-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
  onChange={handleImageFilesChange}
/>
 {imageUrls && (
                    <div className="mt-2 text-xs sm:text-sm text-gray-600">
                      <strong>Preview:</strong> {imageUrls.split('\n').filter(url => url.trim()).length} image(s) added
                    </div>
                  )}
                </div>

                {/* Product Flags */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2 mt-3 sm:mt-4 text-sm sm:text-base">Product Flags</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.isFeatured}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                        className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-xs sm:text-sm text-gray-700">
                        Featured Product
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.isPublished}
                        onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                        className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="published" className="ml-2 block text-xs sm:text-sm text-gray-700">
                        Published
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="col-span-2 mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    {isEditing ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;