import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearCart } from "../../redux/slice/cartSlice";
import { processPayment } from "../../redux/slice/checkoutSlice";
import ThankYouModal from "../Common/ThankYouModal";
import { toast } from "sonner";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { checkout, loading, error, paymentStatus, showThankYouModal } = useSelector((state) => state.checkout);

  // Fallback: get last order from localStorage if Redux state is empty
  const order =
    checkout && checkout._id
      ? checkout
      : JSON.parse(localStorage.getItem("lastOrder"));

  const handleConfirmOrder = async () => {
    try {
      if (!order?._id) {
        toast.error("Order not found");
        return;
      }
      await dispatch(processPayment(order._id)).unwrap();
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error("Failed to process payment");
    }
  };

  const calculateEstimatedDelivery = (createdAt) => {
    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 10);
    return deliveryDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
          Order Confirmation
        </h1>
        {order && (
          <div className="p-6 rounded-lg border border-gray-300">
            <div className="flex justify-between mb-20">
              {/* order id and Date  */}
              <div>
                <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                <p className="text-gray-500">
                  Order date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* Estimated Delivery */}
              <div>
                <p className="text-emerald-700 text-sm">
                  Estimated Delivery:{" "}
                  {calculateEstimatedDelivery(order.createdAt)}
                </p>
              </div>
            </div>
            {/* Order Items */}
            <div className="mb-20">
              {order.checkoutItems.map((item) => (
                <div key={item.productId} className="flex items-center mb-4">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${item?.image}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-md font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.color} | {item.size}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-md">{item.price}</p>
                    <p className="text-sm text-gray-500">qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Payment and Delivery info  */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-2">Payment</h4>
                <p className="text-gray-600">Cash on Delivery</p>
                <p className="text-sm text-emerald-600 mt-1">
                  {paymentStatus === 'success' ? 'Payment Successful' : 'Pending Payment Confirmation'}
                </p>
              </div>
              {/* delivery Info  */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                <p className="text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Confirm Order Button */}
            {paymentStatus !== 'success' && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <ThankYouModal isOpen={showThankYouModal} />
    </>
  );
};

export default OrderConfirmationPage;
