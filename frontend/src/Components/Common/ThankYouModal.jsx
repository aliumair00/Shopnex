import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setShowThankYouModal } from '../../redux/slice/checkoutSlice';

const ThankYouModal = ({ isOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewOrders = () => {
    dispatch(setShowThankYouModal(false));
    navigate('/my-orders');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You For Your Order!
          </h2>
          <p className="text-gray-600 mb-6">
            Your order has been successfully placed. We'll send you an email with your order details.
          </p>
          <button
            onClick={handleViewOrders}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Check My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal; 