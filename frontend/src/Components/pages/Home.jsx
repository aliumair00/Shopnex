import React from "react";
import Hero from "../Layout/Hero";
import Mancollection from "../Products/Mancollection";
import Newarrival from "../Products/Newarrival";
import Productgrid from "../Products/Productgrid";
import FeaturedCollection from "../Products/FeaturedCollection";
import Featuresection from "../Products/Featuresection";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { fetchProductsByFilters } from "../../redux/slice/productSlice";
import Productdetail from "../Products/Productdetail";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    //fetch products for specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );
    //fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        console.log("Best Seller Response:", response.data);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);
  return (
    <>
      <Hero />
      <Mancollection />
      <Newarrival />

      {/* best seller */}
      <h2 className=" text-2xl font-bold text-center mb-4 ">Best Seller</h2>
      {bestSellerProduct ? (
        <Productdetail productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller product...</p>
      )}

      <div className=" container mx-auto ">
        <h2 className="text-3xl  text-center font-bold mb-4 ">
          Top wears for women
        </h2>
        <Productgrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <Featuresection />
    </>
  );
};

export default Home;
