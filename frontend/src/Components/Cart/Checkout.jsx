import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createCheckout } from "../../redux/slice/checkoutSlice";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { loading: checkoutLoading, error: checkoutError } = useSelector(
    (state) => state.checkout
  );
  const { user } = useSelector((state) => state.auth);

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate, location]);

  const handlePaymentSelection = async () => {
    const { firstName, lastName, address, city, postalCode, country, phone } =
      shippingAddress;
    if (
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !postalCode ||
      !country ||
      !phone
    ) {
      toast.error("Please fill in all delivery details before proceeding.");
      return;
    }

    try {
      const checkoutData = {
        checkoutItems: cart.products.map(product => ({
          productId: product?.productId,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: product.quantity
        })),
        shippingAddress: {
          address: `${address} (${firstName} ${lastName})`,
          city,
          postalCode,
          country
        },
        paymentMethod: "cod",
        totalPrice: cart.totalPrice
      };

      await dispatch(createCheckout(checkoutData)).then((res)=>{
        console.log(res)
        navigate(`/order-confirmation/${res.payload._id}`, { state: { orderId: res.payload_id } });

      }).catch((err)=>{
        console.log(err)
      });
      
      // if (result && result.data && result.data._id) {
      //   navigate(`/order-confirmation/${result.data._id}`, { state: { orderId: result.data._id } });
      // } else {
      //   toast.error(result?.message || "Failed to create checkout");
      // }
    } catch (error) {
      if (error === "User not authenticated") {
        navigate("/login", { state: { from: location } });
      } else {
        toast.error(error?.message || "Failed to process checkout");
      }
    }
  };

  if (cartLoading || checkoutLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }

  if (checkoutError) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {checkoutError}</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 ">
      {/* left Section  */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase  mb-6">Checkout</h2>
        <form className="">
          <h3 className="text-lg  mb-4">Contact Details</h3>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-1 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-1 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-1 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4 ">
            <div>
              <label htmlFor="firstName" className="block text-gray-700">
                City
              </label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-1 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-1 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Country
            </label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-1 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Phone
            </label>
            <input
              type="text"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-1 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            {!showPaymentOptions ? (
              <button
                type="button"
                onClick={() => setShowPaymentOptions(true)}
                className="bg-black text-white w-full py-3 rounded hover:bg-gray-800 transition-colors text-lg font-semibold"
              >
                Continue to Payment
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaymentSelection}
                className="w-full py-3 px-4 rounded flex items-center justify-center text-lg font-semibold shadow-md bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Place Order (Cash on Delivery)
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Right Section  */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg mb-4">Order Summary</h2>
        <div className="border-l border-gray-300 py-4 mb-4">
          {cart.products &&
            cart.products.map((product, index) => {
              return (
                <div
                  key={index}
                  className="flex items-start justify-between py-2 border-b border-gray-300 "
                >
                  <div className="flex items-start">
                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80x96?text=No+Image';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-md">{product.name}</h3>
                      <p className="text-gray-500">Size: {product.size}</p>
                      <p className="text-gray-500">Color: {product.color}</p>
                      <p className="text-gray-500">Quantity: {product.quantity}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl">{product.price?.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-between item-center text-lg  mb-4 ">
          <p className="">Subtotal</p>
          <p className="">{cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between item-center text-lg  mb-4 ">
          <p className="">Shipping</p>
          <p className="">Free</p>
        </div>
        <div className="flex justify-between item-center text-lg  mt-4 border-t pt-4 ">
          <p className="">Total</p>
          <p className="">{cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
