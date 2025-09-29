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
import searchFormReducer from "./slices/searchFormSlice"; // ✅ add this

const rootReducer = combineReducers({
  auth: authReducer,
  flights: flightsReducer,
  airports: airportsReducer,
  searchForm: searchFormReducer, // ✅ mount it if you whitelist it
});

const persistConfig = {
  key: "root",
  storage,
  // Persist only what you truly need. Keeping `flights` can be large; safe to remove if you prefer.
  whitelist: ["auth", "airports", "searchForm", "flights"], // ✅ add searchForm here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Silence redux-persist non-serializable warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
