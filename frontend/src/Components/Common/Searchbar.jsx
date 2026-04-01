import React, { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slice/productSlice";
import { RiDeleteBin3Line } from "react-icons/ri";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      dispatch(setFilters({ search: searchTerm }));
      dispatch(fetchProductsByFilters({ search: searchTerm }));
      navigate(`/collection/all?search=${searchTerm}`);
      // Reset search term after submission
      // Close search bar
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen
          ? "absolute top-0 left-0 w-full bg-white h-[16%] z-50  "
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            <button
              type="Submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 "
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover: text-gray-800 "
            onClick={handleToggle}
          >
            <HiMiniXMark className="w-6 h-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleToggle}>
          <HiMagnifyingGlass className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
