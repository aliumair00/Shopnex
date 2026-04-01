import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaClipboardList, FaStore, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const AdminSidebar = ({ closeSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('AdminSidebar - Logging out');
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        console.log('AdminSidebar - After logout, userInfo:', localStorage.getItem("userInfo"));
        console.log('AdminSidebar - After logout, userToken:', localStorage.getItem("userToken"));
        if (closeSidebar) closeSidebar();
        navigate('/');
    }
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 md:p-5 border-b border-gray-800">
        <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center justify-center sm:justify-start transition-colors hover:text-blue-400">
          <span className="text-blue-400 mr-1 sm:mr-2">Shop</span>Nex
        </Link>
      </div>

      <div className="p-2 sm:p-3 md:p-4 flex-grow overflow-y-auto">
        <p className="text-gray-400 text-xs uppercase font-semibold mb-2 sm:mb-3 tracking-wider text-center sm:text-left px-1">Admin Panel</p>
        
        <nav className="space-y-1 sm:space-y-2">
          <NavLink
            to="/admin"
            end
            onClick={() => closeSidebar && closeSidebar()}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 sm:p-2.5 rounded-md transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`
            }
          >
            <FaTachometerAlt className="text-sm sm:text-base flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base truncate">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={() => closeSidebar && closeSidebar()}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 sm:p-2.5 rounded-md transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`
            }
          >
            <FaUsers className="text-sm sm:text-base flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base truncate">Users</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={() => closeSidebar && closeSidebar()}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 sm:p-2.5 rounded-md transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`
            }
          >
            <FaBoxOpen className="text-sm sm:text-base flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base truncate">Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => closeSidebar && closeSidebar()}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 sm:p-2.5 rounded-md transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`
            }
          >
            <FaClipboardList className="text-sm sm:text-base flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base truncate">Orders</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="p-2 sm:p-3 md:p-4 border-t border-gray-800 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 sm:p-2.5 rounded-md text-gray-300 hover:bg-gray-800 w-full text-left transition-colors text-xs sm:text-sm md:text-base group"
          aria-label="Logout"
        >
          <FaSignOutAlt className="text-sm sm:text-base flex-shrink-0 group-hover:text-red-400 transition-colors" />
          <span className="truncate group-hover:text-red-400 transition-colors">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
