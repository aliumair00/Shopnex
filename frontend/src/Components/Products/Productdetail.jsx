import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Productgrid from "./Productgrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slice/productSlice";
import { addToCart } from "../../redux/slice/cartSlice";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Productdetail = ({ productId }) => {
  // const selectproduct = {
  //   name: "stylish jacket ",
  //   price: 200,
  //   originalPrice: 150,
  //   description: "this is stylish jacket perfect for any occasion",
  //   brand: "fashion Hub",
  //   material: "Pure Leather",
  //   sizes: ["S", "M", "L", "XL"],
  //   color: ["Red", "Blue", "Green"],
  //   images: [
  //     {
  //       url: "https://picsum.photos/500/500?random=1",
  //       alttext: "Stylish jacket 1",
  //     },
  //     {
  //       url: "https://picsum.photos/500/500?random=2",
  //       alttext: "Stylish jacket 2",
  //     },
  //   ],
  // };
  // const similarProduct = [
  //   {
  //     _id: 1,
  //     name: "product 1",
  //     price: 300,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500?random=1",
  //       },
  //     ],
  //   },
  //   {
  //     _id: 2,
  //     name: "product 2",
  //     price: 300,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500?random=2",
  //       },
  //     ],
  //   },
  //   {
  //     _id: 3,
  //     name: "product 3",
  //     price: 300,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500?random=3",
  //       },
  //     ],
  //   },
  //   {
  //     _id: 4,
  //     name: "product 4",
  //     price: 300,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500?random=4",
  //       },
  //     ],
  //   },
  // ];

  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, similarProducts } = useSelector(
    (state) => state.product
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      // Store just the URL path without the API_URL prefix
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color before adding to cart.");
      return;
    }
    dispatch(
      addToCart({
        productId: productFetchId,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
        guestId,
        userId: user?._id,
      })
    );
  };

  if (!selectedProduct) {
    return <div className="text-center">Loading product...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col  md:flex-row">
          {/* left thumbnail */}
          <div className="hidden md:flex flex-col  space-y-4 mr-6 ">
            {selectedProduct.images?.map((image, index) => (
              <img
                key={index}
                src={image?.url?.startsWith("http") ? image.url : `${API_URL}${image?.url}`}
                alt={image.alttext || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black " : "border-gray-300"
                } `}
                onClick={() => setMainImage(image.url)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                }}
              />
            ))}
          </div>
          {/* Main Images */}
          <div className="md:w-1/2 ">
            <div className="mb-4">
              <img
                src={mainImage ? (mainImage.startsWith("http") ? mainImage : `${API_URL}${mainImage}`) : ''}
                alt="Main product"
                className="w-full h-auto object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                }}
              />
            </div>
          </div>
          {/* Mobile thumbnail */}
          <div className=" md:hidden flex overscroll-x-auto space-x-4 mb-4">
            {selectedProduct.images?.map((image, index) => (
              <img
                key={index}
                src={image?.url?.startsWith("http") ? image.url : `${import.meta.env.VITE_BACKEND_URL}${image?.url}`}
                alt={image.alttext || `Thumbnail ${index}`}
                className={`w-20 h-20 obj-cover rounded-lg cursor-pointer  border ${
                  mainImage === image.url ? "border-black " : "border-gray-300"
                } `}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>
          {/* Right side */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text:3xl font-semibold mb-2 ">
              {selectedProduct.name}{" "}
            </h1>
            <p className="text-lg text-gray-600 mb-1 line-through ">
              {selectedProduct.originalPrice &&
                `PKR ${selectedProduct.originalPrice}`}
            </p>
            <p className="text-xl text-gray-500 mb-2 ">
              PKR {selectedProduct.price}
            </p>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <div className="mb-4">
              <p className="text-gray-700">Color</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors?.map((color) => (
                  <button
                    onClick={() => setSelectedColor(color)}
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                      ${
                        selectedColor === color
                          ? "border-black ring-2 ring-black"
                          : "border-gray-300"
                      }
                    `}
                    style={{
                      backgroundColor: color.toLowerCase(),
                    }}
                    title={color}
                  >
                    {[
                      "white",
                      "#fff",
                      "#ffffff",
                      "ivory",
                      "beige",
                      "snow",
                    ].includes(color.toLowerCase()) && (
                      <span className="block w-6 h-6 rounded-full border border-gray-400"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">Sizes:</p>
              <div className="flex gap-2 mt-2 ">
                {selectedProduct.sizes?.map((size) => (
                  <button
                    onClick={() => setSelectedSize(size)}
                    key={size}
                    className={`px-4 py-2  rounded border ${
                      selectedSize === size ? "bg-black text-white" : " "
                    } `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2  ">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg "
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg "
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className={`w-full bg-black text-white font-bold py-3 rounded transition-all duration-200 flex items-center justify-center gap-2 hover:bg-gray-900`}
            >
              Add to Cart
            </button>
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4"> characterstics: </h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <h2 className=" text-2xl font-md text-center mb-4 ">
            You May Also Like
          </h2>
          <Productgrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default Productdetail;
