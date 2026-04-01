import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { Outlet, useNavigate, Link } from "react-router-dom";
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Verify admin access on component mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userToken = localStorage.getItem('userToken');
    
    console.log('AdminLayout - User info:', userInfo);
    console.log('AdminLayout - User role:', userInfo?.role);
    console.log('AdminLayout - User token exists:', !!userToken);
    
    // Double-check admin access
    if (!userToken || userInfo?.role !== 'admin') {
      console.error('AdminLayout - Access denied: Not admin or not authenticated');
      navigate('/');
    } else {
      console.log('AdminLayout - Admin access verified');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-gray-50">
      {/* Mobile Toggle Button */}
      <div className="flex md:hidden p-2 sm:p-3 bg-gray-900 text-white z-40 justify-between items-center shadow-md sticky top-0 w-full">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="focus:outline-none p-1 rounded-md hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars size={16} className="text-gray-200" />
          </button>
          <Link to="/" className="ml-2 sm:ml-3 text-base sm:text-lg font-medium flex items-center">
            <span className="text-blue-400 mr-1">Shop</span>Nex
          </Link>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden p-1 rounded-md hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <FaTimes size={16} className={`text-gray-200 ${!isSidebarOpen ? 'hidden' : 'block'}`} />
          </button>
        </div>
      </div>

      {/* Sidebar for mobile and desktop */}
      <div
        className={`fixed md:static top-0 left-0 h-[100dvh] md:h-auto w-[250px] sm:w-[280px] md:w-[240px] lg:w-[260px] bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-xl overflow-y-auto`}
      >
        <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 md:hidden ${isSidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 min-h-screen overflow-auto pt-0 md:pt-2 w-full">
        <div className="w-full max-w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
