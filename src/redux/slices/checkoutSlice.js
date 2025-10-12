// src/redux/slices/checkoutSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // chosen flight + computed pricing/class
  selected: null,
  // traveller/contact info captured in booking form
  primaryTraveller: {
    title: "Mr",
    firstName: "",
    lastName: "",
    dob: "", // YYYY-MM-DD
    nationality: "Bangladeshi",
    postalCode: "",
  },
  contact: {
    mobile: "",
    email: "",
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setSelectedFlight(state, action) {
      state.selected = action.payload || null;
    },
    setPrimaryTraveller(state, action) {
      state.primaryTraveller = {
        ...state.primaryTraveller,
        ...(action.payload || {}),
      };
    },
    setContact(state, action) {
      state.contact = { ...state.contact, ...(action.payload || {}) };
    },
    clearCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSelectedFlight,
  setPrimaryTraveller,
  setContact,
  clearCheckout,
} = checkoutSlice.actions;

export const selectSelectedFlight = (s) => s.checkout?.selected || null;
export const selectPrimaryTraveller = (s) =>
  s.checkout?.primaryTraveller || null;
export const selectContact = (s) => s.checkout?.contact || null;

export default checkoutSlice.reducer;
