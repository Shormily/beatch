import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL;

export const loadAirports = createAsyncThunk("airports/load", async () => {
  const res = await fetch(`/api/ota/settings/airports`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // Normalize (API sometimes returns array-of-arrays)
  const raw = json?.data || [];
  const list = Array.isArray(raw) && Array.isArray(raw[0]) ? raw[0] : raw;

  return (list || []).map((a) => ({
    code: String(a?.code ?? "").trim(),
    name: String(a?.name ?? "").trim(),
    cityName: String(a?.cityName ?? "").trim(),
    countryCode: String(a?.countryCode ?? "").trim(),
    countryName: String(a?.countryName ?? "").trim(),
    timezone: String(a?.timezone ?? "").trim(),
  }));
});

const airportsSlice = createSlice({
  name: "airports",
  initialState: {
    items: [], // the list of airports
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearAirports(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAirports.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAirports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = (action.payload || []).filter(
          (a) => (a.countryCode || "").toUpperCase() === "BD"
        );
        state.lastFetched = Date.now();
      })
      .addCase(loadAirports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to load airports";
      });
  },
});

export const { clearAirports } = airportsSlice.actions;
export default airportsSlice.reducer;
