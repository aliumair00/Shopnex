import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "./../../assets/login 1.jpg";
import { loginUser } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../../redux/slice/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  //get redirect parameter and check if it is checkut  or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Clear invalid user/token data on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("userInfo");
    if (!token || !userInfo) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      // Optionally, dispatch a logout action here if needed
      // dispatch(logout());
    }
  }, []);

  useEffect(() => {
    // Check both user and token
    const token = localStorage.getItem("userToken");
    if (user && token) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : user?.role === "admin" ? "/admin" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : user?.role === "admin" ? "/admin" : "/");
      }
    }
  }, [user, cart, guestId, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login - Submitting with:', { email });
    dispatch(loginUser({ email, password }))
      .then((result) => {
        console.log('Login - Auth result:', result);
        if (result.payload) {
          console.log('Login - User role:', result.payload.role);
        }
      })
      .catch((error) => {
        console.error('Login - Error:', error);
      });
  };

  return (
    <div className="flex">
      <div className="w-full flex md:w-1/2 flex-col justify-center items-center p-8 md:p-12 ">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8  rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-md ">ShopNex</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 ">Hey there!👋</h2>
          <p className="text-center mb-6">
            Enter your username and password to Login.
          </p>
          {error && (
            <div className="mb-4 p-2 text-red-500 text-center bg-red-100 rounded">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 border rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={Loading}
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {Loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="mt-6 text-center text-sm">
            Don't have an account? {""}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800 ">
        <div className="h-full flex fles-col justify-center items-center">
          <img
            src={login}
            alt="Login to account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
