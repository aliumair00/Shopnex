import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./Components/Layout/userlayout";
import Home from "./Components/pages/Home";
import { Toaster } from "sonner";
import Login from "./Components/pages/Login";
import Register from "./Components/pages/Register";
import Profile from "./Components/pages/Profile";
import CollectionPage from "./Components/pages/CollectionPage";
import Productdetail from "./Components/Products/Productdetail";
import Checkout from "./Components/Cart/Checkout";
import OrderConfirmationPage from "./Components/pages/OrderConfirmationPage";
import OrderDetails from "./Components/pages/OrderDetails";
import MyOrder from "./Components/pages/MyOrder";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminHomePage from "./Components/Admin/AdminHomePage";
import UserManagement from "./Components/Admin/UserManagement";
import ProductManagement from "./Components/Admin/ProductManagement";
import EditProduct from "./Components/Admin/EditProduct";
import OrderManagement from "./Components/Admin/OrderManagement";
import { ProtectedRoute, AuthRoute } from "./Components/Common/ProtectedRoute";

import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route 
              path="login" 
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } 
            />
            <Route 
              path="register" 
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route
              path="collection/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<Productdetail />} />
            <Route 
              path="checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route
              path="order-confirmation/:id"
              element={
                <ProtectedRoute>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="order/:id" 
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-orders" 
              element={
                <ProtectedRoute>
                  <MyOrder />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Admin Layout */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
          
          {/* Debug route for admin access */}
          <Route 
            path="/admin-debug" 
            element={
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Debug Page</h1>
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify({
                    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
                    hasToken: !!localStorage.getItem('userToken')
                  }, null, 2)}
                </pre>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
