import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../redux/slice/dashboardSlice";
import { FaSpinner, FaChartLine, FaShoppingBag, FaBoxOpen } from "react-icons/fa";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);
  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-center sm:text-left text-gray-800">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-3xl sm:text-4xl text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base mx-2 sm:mx-0">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Revenue Card */}
            <div className="p-3 sm:p-4 md:p-5 shadow-md rounded-lg bg-white border-l-4 border-green-500 flex flex-col justify-between h-full transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Revenue</h2>
                <FaChartLine className="text-green-500 text-lg sm:text-xl" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 text-green-600 break-words">PKR {stats.totalRevenue?.toLocaleString() || 0}</p>
              <div className="text-xs text-gray-500 mt-2">Total earnings</div>
            </div>

            {/* Total Orders */}
            <div className="p-3 sm:p-4 md:p-5 shadow-md rounded-lg bg-white border-l-4 border-blue-500 flex flex-col justify-between h-full transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Total Orders</h2>
                <FaShoppingBag className="text-blue-500 text-lg sm:text-xl" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 text-blue-600">{stats.totalOrders || 0}</p>
              <Link to="/admin/orders" className="text-blue-500 hover:underline block mt-2 text-xs sm:text-sm">
                Manage Orders →
              </Link>
            </div>

            {/* Total products */}
            <div className="p-3 sm:p-4 md:p-5 shadow-md rounded-lg bg-white border-l-4 border-purple-500 flex flex-col justify-between h-full transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Total Products</h2>
                <FaBoxOpen className="text-purple-500 text-lg sm:text-xl" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 text-purple-600">{stats.totalProducts || 0}</p>
              <Link to="/admin/products" className="text-blue-500 hover:underline block mt-2 text-xs sm:text-sm">
                Manage Products →
              </Link>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 md:mt-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-center sm:text-left text-gray-800">Recent Orders</h2>
            <div className="overflow-hidden bg-white rounded-lg shadow">
              {/* Mobile card view for orders */}
              <div className="block sm:hidden">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {stats.recentOrders.map((order) => (
                      <div key={order._id} className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-gray-900">Order ID</span>
                            <span className="text-xs text-gray-600 truncate max-w-[150px]">{order._id}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-xs text-gray-500 block">Customer</span>
                            <span className="text-xs font-medium">{order.user?.name || 'Unknown User'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Amount</span>
                            <span className="text-xs font-medium">PKR {order.totalPrice?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm p-4 text-gray-500">No orders found.</div>
                )}
              </div>
              
              {/* Desktop table view */}
              <div className="overflow-x-auto">
                <table className="hidden sm:table min-w-full text-left text-gray-500">
                  <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="py-2 px-2 sm:py-3 sm:px-4 md:px-6">Order ID</th>
                      <th className="py-2 px-2 sm:py-3 sm:px-4 md:px-6">User</th>
                      <th className="py-2 px-2 sm:py-3 sm:px-4 md:px-6">Total Price</th>
                      <th className="py-2 px-2 sm:py-3 sm:px-4 md:px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-2 sm:p-3 md:p-4 font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px] lg:max-w-none">{order._id}</td>
                          <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{order.user?.name || 'Unknown User'}</td>
                          <td className="p-2 sm:p-3 md:p-4 font-medium text-xs sm:text-sm">PKR {order.totalPrice?.toLocaleString() || 0}</td>
                          <td className="p-2 sm:p-3 md:p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-2 sm:p-3 md:p-4 text-gray-500 text-center text-xs sm:text-sm">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
