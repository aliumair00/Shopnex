import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("User not authenticated");
      }

      // Format checkout items to match backend schema
      const formattedCheckoutData = {
        ...checkoutData,
        checkoutItems: checkoutData.checkoutItems.map(item => ({
          product: item._id, // Changed from productId to product to match backend
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        formattedCheckoutData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data, 'chekout wali api')

      return response.data?.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to create checkout session"
      );
    }
  }
);

export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data, 'finalize pay wali api')

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to finalize checkout"
      );
    }
  }
);
// New thunk for processing payment
export const processPayment = createAsyncThunk(
  "checkout/processPayment",
  async (checkoutId, { dispatch, rejectWithValue }) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        return rejectWithValue("User not authenticated");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: "pay"
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data, 'process pay wali api')
      // If payment is successful, dispatch finalize checkout
    if (response.data) {
        await dispatch(finalizeCheckout(checkoutId)).unwrap();
      }

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to process payment"
      );
    }
  }
);

// New thunk for finalizing checkout


const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
    paymentStatus: null,
    finalizeStatus: null,
    showThankYouModal: false
  },
  reducers: {
    clearCheckout: (state) => {
      state.checkout = null;
      state.error = null;
      state.paymentStatus = null;
      state.finalizeStatus = null;
      state.showThankYouModal = false;
    },
    setShowThankYouModal: (state, action) => {
      state.showThankYouModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.error = null;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Payment processing cases
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'success';
        state.error = null;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'failed';
        state.error = action.payload;
      })
      // Finalize checkout cases
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.finalizeStatus = 'success';
        state.showThankYouModal = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.finalizeStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCheckout, setShowThankYouModal } = checkoutSlice.actions;
export default checkoutSlice.reducer;

