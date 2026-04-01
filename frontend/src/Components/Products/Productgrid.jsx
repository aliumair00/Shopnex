import React from "react";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Productgrid = ({ products, loading, error }) => {
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link
          key={product._id || index}
          to={`/product/${product._id}`}
          className="block"
        >
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-56 mb-4">
              <img
                src={product?.images && product.images.length > 0 ? 
                  (product.images[0]?.url?.startsWith("http") ? product.images[0].url : `${API_URL}${product.images[0]?.url}`) : 
                  'https://via.placeholder.com/400x400?text=No+Image'}
                alt={product.images?.[0]?.altText || product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                }}
              />
            </div>
            <h3 className="text-sm mb-2">{product.name}</h3>
            <p className="text-gray-500 font-md text-sm tracking-tighter">
              PKR {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Productgrid;
