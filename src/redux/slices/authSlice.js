import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL;
const APP_SECRATE = import.meta.env.VITE_APP_SECRET;

export const fetchToken = createAsyncThunk(
  "auth/fetchToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/app/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // simple headers = simpler preflight
        body: JSON.stringify({ appSecrate: import.meta.env.VITE_APP_SECRATE }),
      });
      if (!res.ok) throw new Error(`Token fetch failed (${res.status})`);
      const data = await res.json();
      return data?.token;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch token");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearToken(state) {
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
    setToken(state, action) {
      state.token = action.payload || null;
      state.status = action.payload ? "succeeded" : "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message || "Token error";
      });
  },
});

export const { clearToken, setToken } = authSlice.actions;
export default authSlice.reducer;
