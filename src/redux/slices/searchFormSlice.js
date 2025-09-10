// src/redux/slices/searchFormSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tripType: "ONE_WAY",
  fromText: "",
  toText: "",
  fromAirport: null, // { code, name, ... } if you want to store it
  toAirport: null,
  departureDate: "",
  returnDate: "",
  travellers: {
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "Economy",
    childAges: [],
  },
  preferredAirline: "",
  apiId: 1001,
};

const searchFormSlice = createSlice({
  name: "searchForm",
  initialState,
  reducers: {
    setForm(state, action) {
      return { ...state, ...action.payload };
    },
    resetForm() {
      return initialState;
    },
  },
});

export const { setForm, resetForm } = searchFormSlice.actions;
export default searchFormSlice.reducer;
