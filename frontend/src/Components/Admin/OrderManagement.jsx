import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAllOrders, 
  updateOrderStatus, 
  deleteOrder 
} from "../../redux/slice/adminOrderSlice";
import { FaTrash } from "react-icons/fa";

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
console.log(orders, 'orders')
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status }));
      dispatch(fetchAllOrders()); // Refresh orders after update
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOrder) {
      try {
        await dispatch(deleteOrder(selectedOrder._id));
        setShowDeleteModal(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // Delete Modal Component
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Confirm Deletion</h3>
        <p className="mb-4 text-sm sm:text-base">Are you sure you want to delete order #{selectedOrder._id}?</p>
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
  );

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left text-gray-800">Order Management</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500 text-sm sm:text-base">{error}</div>
      ) : (
        <>
          {/* Mobile view - card layout */}
          <div className="block sm:hidden">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm mb-3 p-3 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">Order #{order._id.substring(0, 8)}...</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <p className="mb-1"><span className="font-medium">Customer:</span> {order.user?.name || 'N/A'}</p>
                    <p className="mb-2"><span className="font-medium">Total:</span> PKR {order.totalPrice}</p>
                  </div>
                  <div className="mb-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 p-2"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange(order._id, "delivered")}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                    <button
                      onClick={() => handleDelete(order)}
                      className="bg-red-100 text-red-500 p-1 rounded hover:bg-red-200 transition-colors"
                      title="Delete Order"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No orders found.
              </div>
            )}
          </div>
          
          {/* Desktop view - table layout */}
          <div className="hidden sm:block overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full text-left text-gray-500">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Order ID</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Customer</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Total Price</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Status</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-3 sm:py-3 sm:px-4 font-medium text-gray-900 text-sm">
                        #{order._id}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm">{order.user?.name || 'N/A'}</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm">PKR {order.totalPrice}</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded focus:ring-blue-500 focus:border-blue-500 p-1.5 sm:p-2"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleStatusChange(order._id, "delivered")}
                            className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs hover:bg-blue-600 transition-colors"
                          >
                            Mark as Delivered
                          </button>
                          <button
                            onClick={() => handleDelete(order)}
                            className="bg-red-100 text-red-500 p-1.5 rounded hover:bg-red-200 transition-colors"
                            title="Delete Order"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedOrder && <DeleteModal />}
    </div>
  );
};

export default OrderManagement;
