import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import Cartcontents from "../Cart/Cartcontents";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/slice/cartSlice";

const Cartdrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;
  const dispatch = useDispatch();
  
  // Debug information
  console.log('Cartdrawer - User:', user);
  console.log('Cartdrawer - UserId:', userId);
  console.log('Cartdrawer - GuestId:', guestId);
  console.log('Cartdrawer - User Role:', user?.role);
  const handleCheckout = () => {
    onClose();
    if (!user) {
      navigate("/login", { 
        state: { 
          from: "/checkout",
          message: "Please login to proceed with checkout" 
        } 
      });
    } else {
      navigate("/checkout");
    }
  };

  useEffect(()=>{
    if(isOpen){
      dispatch(fetchCart({userId, guestId}));
    }
  },[isOpen])
  return (
    <div
      className={`fixed top-0 right-0 w-80 sm:w-96 md:w-[30rem] h-full bg-white shadow-lg  transform transition-transform duration-300 flex flex-col z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <IoMdClose
          onClick={onClose}
          className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900"
        />
      </div>

      <div className="flex-grow  p-4 overflow-y-auto ">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {cart && cart?.products?.length > 0 ? (
          <Cartcontents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p className="">Your cart is empty.</p>
        )}
        {/* components for cart */}
      </div>

      {/* checkout button at the bottom */}
      <div className="p-4 bg-white sticky  bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="bg-black text-white p-3 w-full font-semibold rounded-lg hover:bg-gray-800"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 text-center mt-2">
              shipping taxes and discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Cartdrawer;
