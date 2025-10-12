// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./slices/authSlice";
import flightsReducer from "./slices/flightsSlice";
import airportsReducer from "./slices/airportsSlice";
import searchFormReducer from "./slices/searchFormSlice";
import checkoutReducer from "./slices/checkoutSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  flights: flightsReducer,
  airports: airportsReducer,
  searchForm: searchFormReducer,
  checkout: checkoutReducer,
});

// 🚀 add a version + migrate to handle old auth shape
const persistConfig = {
  key: "root",
  storage,
  version: 2,
  whitelist: ["auth", "airports", "searchForm", "flights", "checkout"],
  migrate: async (state) => {
    if (!state) return state;

    try {
      const s = { ...state };

      // If auth exists but doesn't have the new nested keys, wrap it.
      const a = s.auth && typeof s.auth === "object" ? s.auth : null;
      const hasNewShape = a && ("app" in a || "user" in a);

      if (a && !hasNewShape) {
        s.auth = {
          app: {
            token: a.token ?? null,
            expire: a.expire ?? null,
            status: a.status ?? "idle",
            error: a.error ?? null,
          },
          user: {
            token: null,
            expire: null,
            profile: null,
            status: "idle",
            error: null,
            isAuthenticated: false,
          },
        };
      }

      return s;
    } catch {
      // As a fallback, drop persisted state if migration fails
      return undefined;
    }
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
