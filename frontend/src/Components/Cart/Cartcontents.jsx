import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slice/cartSlice";

const Cartcontents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Debug information
  console.log('Cartcontents - User:', user);
  console.log('Cartcontents - UserId:', userId);
  console.log('Cartcontents - GuestId:', guestId);

  //handle adding or substracting to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    console.log('Updating quantity:', { productId, newQuantity, size, color });
    
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId: user?.role === 'admin' ? null : guestId,
          userId,
          size,
          color,
        })
      );
    }
  };
  
  const handleRemoveFromCarts = (productId, size, color) => {
    console.log('Removing from cart:', {
      productId,
      size, 
      color,
      guestId: user?.role === 'admin' ? null : guestId,
      userId,
    });
    
    dispatch(
      removeFromCart({
        productId,
        size, 
        color,
        guestId: user?.role === 'admin' ? null : guestId,
        userId,
      })
    );
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between border-b py-4"
        >
          <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${product?.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/80x96?text=No+Image';
              }}
            />
          </div>
          <div className="flex-1 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Size: {product.size} | Color: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border-[0.5] rounded px-1 py-1 font-medium text-xl"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      +1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border-[0.5] rounded px-1 py-1 font-medium text-xl"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end ml-4">
              <p className="font-medium">
                PKR {product.price.toLocaleString()}
              </p>
              <button
                onClick={() =>
                  handleRemoveFromCarts(
                    product.productId,
                    product.size,
                    product.color
                  )
                }
                className="text-gray-500 hover:text-red-500 mt-2"
              >
                <RiDeleteBin3Line className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cartcontents;
