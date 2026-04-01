import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import Searchbar from "./Searchbar";
import Cartdrawer from "./Cartdrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <Link to="/" className="text-2xl font-medium">
            ShopNex
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collection/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            mens
          </Link>
          <Link
            to="/collection/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Womens
          </Link>
          <Link
            to="/collection/all?category=top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top wear
          </Link>
          <Link
            to="/collection/all?category=bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            bottom wear
          </Link>
        </div>

        {/* Right Icons  */}
        <div className="flex items-center space-x-4">
          {user?.role === 'admin' && (
            <Link
              to="/admin/users"
              className="block bg-black text-white px-2 text-sm rounded"
            >
              Admin
            </Link>
          )}
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="w-6 h-6 text-gray-700" />
          </Link>
          <button className="relative hover:text-black" onClick={toggleCart}>
            <HiOutlineShoppingBag className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-[#ea2e0e] text-white rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
          <div className="overflow-hidden">
            <Searchbar />
          </div>
        </div>
      </nav>
      <Cartdrawer isOpen={isCartOpen} onClose={toggleCart} />

      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600 hover:text-gray-900" />
          </button>
        </div>
        <div className="px-4 py-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Menu
          </h2>
          <Link
            to="/collection/all?gender=Men"
            onClick={toggleNavDrawer}
            className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            mens
          </Link>
          <Link
            to="/collection/all?gender=Women"
            onClick={toggleNavDrawer}
            className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Womens
          </Link>
          <Link
            to="/collection/all?category=top Wear"
            onClick={toggleNavDrawer}
            className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top wear
          </Link>
          <Link
            to="/collection/all?category=bottom Wear"
            onClick={toggleNavDrawer}
            className="block text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            bottom wear
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
