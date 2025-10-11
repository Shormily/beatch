// src/redux/slices/flightsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { selectBestToken, selectAuthHeader } from "./authSlice";

const API_BASE = import.meta.env.VITE_API_URL;
const DEFAULT_API_ID = Number(import.meta?.env?.VITE_FLIGHTS_API_ID || 1001);

function buildPassengers({ adults = 1, children = 0, infants = 0 }) {
  const pax = [];
  if (adults > 0) pax.push({ passengerType: "ADT", quantity: adults });
  if (children > 0) pax.push({ passengerType: "CHD", quantity: children });
  if (infants > 0) pax.push({ passengerType: "INF", quantity: infants });
  return pax;
}

function mapClassToCabinClass(label) {
  if (!label) return null;
  const L = String(label).toLowerCase();
  if (L.includes("business")) return "Business";
  if (L.includes("first")) return "First";
  if (L.includes("premium")) return "PremiumEconomy";
  return "Economy";
}

export const searchFlights = createAsyncThunk(
  "flights/search",
  async (args, { getState, rejectWithValue }) => {
    try {
      const state = getState?.() ?? undefined;

      // Prefer user token; fall back to app token; allow override via args.token
      const token =
        (args && args.token) || (state ? selectBestToken(state) : null);
      if (!token) {
        throw new Error(
          "Missing auth token. Ensure auth slice is mounted and app/user token exists, or pass { token } to searchFlights."
        );
      }

      const {
        tripType = "ONE_WAY",
        fromCode,
        toCode,
        departureDate,
        returnDate,
        travellers = { adults: 1, children: 0, infants: 0 },
        travelClassLabel,
        preferredAirline,
        apiId,
      } = args || {};

      if (!fromCode || !toCode || !departureDate) {
        throw new Error("fromCode, toCode and departureDate are required.");
      }

      const originDestinationOptions = [
        {
          departureAirport: fromCode,
          arrivalAirport: toCode,
          flyDate: departureDate,
        },
      ];
      if (tripType === "ROUND_TRIP" && returnDate) {
        originDestinationOptions.push({
          departureAirport: toCode,
          arrivalAirport: fromCode,
          flyDate: returnDate,
        });
      }

      const body = {
        originDestinationOptions,
        passengers: buildPassengers(travellers),
        cabinClass: mapClassToCabinClass(travelClassLabel),
        preferredAirline: preferredAirline ?? null,
        apiId: Number(apiId ?? DEFAULT_API_ID),
      };

      // ✅ FIX: single headers object; no nested "headers" key
      const res = await fetch(`${API_BASE}/api/flights/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(state
            ? selectAuthHeader(state)
            : { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        if (res.status === 401)
          throw new Error("Unauthorized (401). Token missing/expired/invalid.");
        throw new Error(
          `Search failed (${res.status}). ${text || "No details"}`
        );
      }

      const data = await res.json().catch(() => ({}));
      return { data, criteria: body };
    } catch (err) {
      return rejectWithValue(err?.message || "Search failed");
    }
  }
);

const flightsSlice = createSlice({
  name: "flights",
  initialState: {
    results: null,
    criteria: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearResults(state) {
      state.results = null;
      state.criteria = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state, action) => {
        state.status = "loading";
        state.error = null;

        const a = action.meta?.arg || {};
        const {
          tripType = "ONE_WAY",
          fromCode,
          toCode,
          departureDate,
          returnDate,
          travellers = { adults: 1, children: 0, infants: 0 },
          travelClassLabel,
          preferredAirline,
          apiId,
        } = a;

        if (fromCode && toCode && departureDate) {
          const originDestinationOptions = [
            {
              departureAirport: fromCode,
              arrivalAirport: toCode,
              flyDate: departureDate,
            },
          ];
          if (tripType === "ROUND_TRIP" && returnDate) {
            originDestinationOptions.push({
              departureAirport: toCode,
              arrivalAirport: fromCode,
              flyDate: returnDate,
            });
          }

          state.criteria = {
            originDestinationOptions,
            passengers: buildPassengers(travellers),
            cabinClass: mapClassToCabinClass(travelClassLabel),
            preferredAirline: preferredAirline ?? null,
            apiId: Number(apiId ?? DEFAULT_API_ID),
          };
        }
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload?.data ?? null;
        state.criteria = action.payload?.criteria ?? state.criteria;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error?.message || "Search failed";
      });
  },
});

export const { clearResults } = flightsSlice.actions;
export default flightsSlice.reducer;
