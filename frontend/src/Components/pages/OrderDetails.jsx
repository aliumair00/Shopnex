import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (
        <p>No Order details found</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border border-gray-300 ">
          {/* order info  */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid ? "Paid" : "Pending"}
              </span>
              <span
                className={`${
                  orderDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {/* {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"} */}
                {orderDetails.status}
              </span>
            </div>
          </div>

          {/* Customer payment and shipping info  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Payment Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
              {orderDetails.paidAt && (
                <p>Paid At: {new Date(orderDetails.paidAt).toLocaleString()}</p>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p>Address: {orderDetails.shippingAddress.address}</p>
              <p>
                {orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.country}
              </p>
              <p>Postal Code: {orderDetails.shippingAddress.postalCode}</p>
            </div>
          </div>

          {/* Product List  */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <table className="min-w-full text-gray-600 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Unit Price</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr
                    key={item.productId}
                    className="border-b border-gray-200"
                  >
                    <td className="py-2 px-4 flex items-center">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${item?.image}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{item.price}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">
                      {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Price */}
          <div className="flex justify-end mt-6 border-t pt-4">
            <div className="text-xl font-semibold">
              Total: PKR {orderDetails.totalPrice.toLocaleString()}
            </div>
          </div>

          {/* back to order Link */}
          <Link to="/my-orders" className="text-blue-500 hover:underline mt-6 inline-block">
            Back to My Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
