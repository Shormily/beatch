// src/redux/slices/flightsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL;
const DEFAULT_API_ID = Number(import.meta?.env?.VITE_FLIGHTS_API_ID || 1001);

function buildPassengers({ adults = 1, children = 0, infants = 0 }) {
  const pax = [];
  if (adults > 0) pax.push({ passengerType: "ADT", quantity: adults });
  if (children > 0) pax.push({ passengerType: "CHD", quantity: children });
  if (infants > 0) pax.push({ passengerType: "INF", quantity: infants });
  return pax;
}

function mapClassToCabinClasse(label) {
  if (!label) return null; // return null (not undefined) so it serializes
  const L = String(label).toLowerCase();
  if (L.includes("business")) return "BUSINESS";
  if (L.includes("first")) return "FIRST";
  if (L.includes("premium")) return "PREMIUM_ECONOMY";
  return "ECONOMY";
}

/**
 * Args supported:
 * {
 *   tripType: "ONE_WAY" | "ROUND_TRIP",
 *   fromCode, toCode, departureDate, returnDate?,
 *   travellers: { adults, children, infants },
 *   travelClassLabel, preferredAirline, apiId?,
 *   token? // optional override; if omitted we read from state.auth.token
 * }
 */
export const searchFlights = createAsyncThunk(
  "flights/search",
  async (args, { getState, rejectWithValue }) => {
    try {
      const state = typeof getState === "function" ? getState() : undefined;
      const token =
        (args && args.token) || // allow passing token in args
        state?.auth?.token; // or read from store at state.auth.token

      if (!token) {
        throw new Error(
          "Missing auth token. Ensure reducer is mounted at state.auth or pass { token } to searchFlights."
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
        cabinClasse: mapClassToCabinClasse(travelClassLabel), // e.g. "BUSINESS" | "ECONOMY" | null
        preferredAirline: preferredAirline ?? null, // keep key in payload
        apiId: Number(apiId ?? DEFAULT_API_ID),
      };

      const res = await fetch(`/api/ota/flights/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        if (res.status === 401) {
          throw new Error("Unauthorized (401). Token missing/expired/invalid.");
        }
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
    status: "idle", // idle | loading | succeeded | failed
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
      .addCase(searchFlights.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload?.data ?? null;
        state.criteria = action.payload?.criteria ?? null;
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
