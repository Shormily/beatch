import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL;

async function fetchAllAirports() {
  const res = await fetch(`${API_BASE}/api/settings/airports`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch airports");
  const json = await res.json();

  // Normalize to a flat array of airport objects
  const raw = json?.data ?? [];
  const list =
    Array.isArray(raw) && Array.isArray(raw[0])
      ? raw[0] // array-of-arrays → first array
      : raw;

  // Ensure objects with required fields; coerce to strings
  return (list || []).map((a) => ({
    code: String(a?.code ?? "").trim(),
    name: String(a?.name ?? "").trim(),
    cityName: String(a?.cityName ?? "").trim(),
    countryCode: String(a?.countryCode ?? "").trim(),
    countryName: String(a?.countryName ?? "").trim(),
    timezone: String(a?.timezone ?? "").trim(),
  }));
}

/**
 * Thunk: ensure airports are loaded, then filter by query locally.
 * Returns a string[] for the suggestions dropdown.
 */
export const fetchSuggestions = createAsyncThunk(
  "search/fetchSuggestions",
  async (query, { getState, rejectWithValue }) => {
    const state = getState().search;
    let airports = state.airports;

    // Load once (and persist)
    if (!airports || !airports.length) {
      try {
        airports = await fetchAllAirports();
      } catch (e) {
        return rejectWithValue(e.message || "Failed to load airports");
      }
    }

    const q = (query || "").trim().toLowerCase();
    if (!q) return { query, items: [] };

    // Filter by code, name, city, country (startsWith first, then includes)
    const starts = [];
    const includes = [];

    for (const a of airports) {
      const hay = [
        a.code.toLowerCase(),
        a.name.toLowerCase(),
        a.cityName.toLowerCase(),
        a.countryName.toLowerCase(),
      ];
      const label = `${a.code} — ${a.name} (${a.cityName}, ${a.countryName})`;

      if (hay.some((h) => h.startsWith(q))) {
        starts.push(label);
      } else if (hay.some((h) => h.includes(q))) {
        includes.push(label);
      }
    }

    // Dedup + cap results
    const items = Array.from(new Set([...starts, ...includes])).slice(0, 20);

    return {
      query,
      items,
      airports, // pass back if we had to fetch
    };
  }
);

const MAX_RECENT = 8;

const initialState = {
  query: "",
  suggestions: [],
  status: "idle",
  error: undefined,
  recent: [],
  highlightedIndex: -1,
  open: false,

  // NEW: persisted full list
  airports: [], // [{code,name,cityName,countryName,...}]
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    setOpen(state, action) {
      state.open = action.payload;
    },
    highlightNext(state) {
      if (!state.suggestions.length) return;
      state.highlightedIndex =
        (state.highlightedIndex + 1) % state.suggestions.length;
    },
    highlightPrev(state) {
      if (!state.suggestions.length) return;
      state.highlightedIndex =
        (state.highlightedIndex - 1 + state.suggestions.length) %
        state.suggestions.length;
    },
    selectSuggestion(state, action) {
      const value = action.payload;
      state.query = value;
      state.open = false;
      state.recent = [value, ...state.recent.filter((q) => q !== value)].slice(
        0,
        MAX_RECENT
      );
    },
    clearSuggestions(state) {
      state.suggestions = [];
      state.highlightedIndex = -1;
    },
    clearRecent(state) {
      state.recent = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { items, airports } = action.payload;
        state.suggestions = items;
        state.highlightedIndex = items.length ? 0 : -1;
        state.open = true;
        if (airports && airports.length && !state.airports.length) {
          state.airports = airports; // save once; persisted by redux-persist
        }
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error?.message || "Unknown error";
      });
  },
});

export const {
  setQuery,
  setOpen,
  highlightNext,
  highlightPrev,
  selectSuggestion,
  clearSuggestions,
  clearRecent,
} = searchSlice.actions;

export default searchSlice.reducer;
