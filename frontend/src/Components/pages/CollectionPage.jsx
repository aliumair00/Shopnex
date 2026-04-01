import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../Products/FilterSidebar";
import SortOption from "../Products/SortOption";
import Productgrid from "../Products/Productgrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { fetchProductsByFilters } from "../../redux/slice/productSlice";
const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const queryparams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleClickOutside = (e) => {
    // Close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryparams }));
  }, [dispatch, collection, searchParams]);
  useEffect(() => {
    // Add Event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center "
      >
        <FaFilter className="mr-2" />
      </button>

      {/* Filter sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-0 z-50 w-60 left-0 bg-white overflow-y-auto transition-transform duration-300 ease-in-out  lg:static lg:translate-x-0 `}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase font-bold mb-4">All Collection</h2>

        {/* sort option  */}
        <SortOption />

        {/* Product Grid  */}
        <Productgrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
