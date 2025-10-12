// src/redux/slices/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL;
const APP_SECRATE = import.meta.env.VITE_APP_SECRET; // keeping your current env key

/* ===================== APP TOKEN (for preloaders) ===================== */
export const fetchToken = createAsyncThunk(
  "auth/fetchAppToken",
  async (_, { rejectWithValue }) => {
    try {
      if (!APP_SECRATE) throw new Error("Missing VITE_APP_SECRATE in .env");

      const res = await fetch(`${API_BASE}/api/auth/app/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appSecrate: APP_SECRATE }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Token fetch failed (${res.status}) ${text}`);
      }

      const data = await res.json();
      const token =
        data?.token || data?.access_token || data?.data?.token || null;

      if (!token) throw new Error("No token found in response payload");

      return { token, expire: data?.expire || null };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch token");
    }
  }
);

/* ===================== USER LOGIN (email/password) ===================== */
export const loginCustomer = createAsyncThunk(
  "auth/loginCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const { email, password } = payload || {};
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const res = await fetch(`${API_BASE}/api/auth/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // API expects "username" not "email"
        body: JSON.stringify({ username: email, password }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Login failed (${res.status}) ${text?.slice(0, 200)}`);
      }

      if (!res.ok || data?.isSuccess === false) {
        const msg =
          data?.messages?.[0] ||
          data?.message ||
          `Login failed (${res.status})`;
        throw new Error(msg);
      }

      const token = data?.token || data?.access_token || null;
      if (!token) throw new Error("No token found in login response");

      return {
        token,
        expire: data?.expire || null,
        profile: {
          id: data?.id || data?.UserId || data?.CustomerId || null,
          name: data?.name || data?.Name || "",
          email: data?.email || data?.unique_name || "",
          phone: data?.phone || "",
          role: data?.role || data?.RoleIds || null,
          url: data?.url || null,
        },
        raw: data,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

/* ===================== SIGNUP + VERIFY ===================== */
const genTempPassword = () =>
  `Tmp@${Math.random().toString(36).slice(2, 8)}${Date.now()
    .toString()
    .slice(-2)}`;

export const signupCustomer = createAsyncThunk(
  "auth/signupCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const {
        email,
        mobile,
        name,
        password,
        optionalFields = {},
      } = payload || {};
      if (!email || !mobile) throw new Error("Email and mobile are required");

      // Derive names if only "name" provided
      let firstName = optionalFields.firstName;
      let lastName = optionalFields.lastName;
      if (!firstName && name) {
        const parts = String(name).trim().split(/\s+/);
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }

      const passwordUsed = password || genTempPassword();

      const res = await fetch(`${API_BASE}/api/auth/customer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // mandatory
          email,
          password: passwordUsed,
          mobile,
          // optional — only include if present
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(optionalFields.dob ? { dob: optionalFields.dob } : {}),
          ...(optionalFields.address
            ? { address: optionalFields.address }
            : {}),
          ...(optionalFields.gender ? { gender: optionalFields.gender } : {}),
          ...(optionalFields.ipAddress
            ? { ipAddress: optionalFields.ipAddress }
            : {}),
          ...(optionalFields.state ? { state: optionalFields.state } : {}),
          ...(optionalFields.zip ? { zip: optionalFields.zip } : {}),
          ...(optionalFields.country
            ? { country: optionalFields.country }
            : {}),
          ...(optionalFields.passportNumber
            ? { passportNumber: optionalFields.passportNumber }
            : {}),
          ...(optionalFields.passportExpiry
            ? { passportExpiry: optionalFields.passportExpiry }
            : {}),
        }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // ignore parse error; show generic error below if needed
      }

      if (!res.ok || data?.isSuccess === false) {
        const msg =
          data?.messages?.[0] ||
          data?.message ||
          `Signup failed (${res.status})`;
        throw new Error(msg);
      }

      return { email, mobile, passwordUsed };
    } catch (err) {
      return rejectWithValue(err.message || "Signup failed");
    }
  }
);

export const verifySignupCode = createAsyncThunk(
  "auth/verifySignupCode",
  async (payload, { rejectWithValue }) => {
    try {
      const { code, email, resend = false } = payload || {};
      if (!email) throw new Error("verifyEmail (email) is required");

      const body = {
        VerificationCode: resend ? "" : code,
        verifyEmail: email,
        IsResend: Boolean(resend),
      };

      const res = await fetch(`${API_BASE}/api/auth/customer/verifycode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // ignore parse error; show generic error below if needed
      }

      if (!res.ok || data?.isSuccess === false) {
        const msg =
          data?.messages?.[0] ||
          data?.message ||
          `Verify failed (${res.status})`;
        throw new Error(msg);
      }

      return { ok: true, email };
    } catch (err) {
      return rejectWithValue(err.message || "Verification failed");
    }
  }
);

/* ===================== SLICE ===================== */
const initialState = {
  app: {
    token: null,
    expire: null,
    status: "idle",
    error: null,
  },
  user: {
    token: null,
    expire: null,
    profile: null,
    status: "idle",
    error: null,
    isAuthenticated: false,
    // registration helpers:
    pendingSignup: null, // { email, mobile, passwordUsed }
    verifyStatus: "idle", // idle | loading | succeeded | failed
    verifyError: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // app token manual set/clear
    setAppToken(state, action) {
      state.app.token = action.payload?.token || action.payload || null;
      state.app.expire = action.payload?.expire || null;
      state.app.status = state.app.token ? "succeeded" : "idle";
      state.app.error = null;
    },
    clearAppToken(state) {
      state.app = { ...initialState.app };
    },

    // user auth controls
    logout(state) {
      state.user = { ...initialState.user };
    },
    setUserToken(state, action) {
      state.user.token = action.payload?.token || action.payload || null;
      state.user.expire = action.payload?.expire || null;
      state.user.isAuthenticated = Boolean(state.user.token);
      if (!state.user.token) state.user.profile = null;
      state.user.status = state.user.token ? "succeeded" : "idle";
      state.user.error = null;
    },
    setUserProfile(state, action) {
      state.user.profile = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    /* ---- app token ---- */
    builder
      .addCase(fetchToken.pending, (state) => {
        state.app.status = "loading";
        state.app.error = null;
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        state.app.status = "succeeded";
        state.app.token = action.payload.token;
        state.app.expire = action.payload.expire || null;
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.app.status = "failed";
        state.app.error =
          action.payload || action.error?.message || "Token error";
      });

    /* ---- user login ---- */
    builder
      .addCase(loginCustomer.pending, (state) => {
        state.user.status = "loading";
        state.user.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.user.status = "succeeded";
        state.user.token = action.payload.token;
        state.user.expire = action.payload.expire || null;
        const p = action.payload || {};
        state.user.profile = p.profile || p.raw || null; // ✅ ensure profile is never null
        state.user.isAuthenticated = true;
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.user.status = "failed";
        state.user.error =
          action.payload || action.error?.message || "Login error";
        state.user.isAuthenticated = false;
      });

    /* ---- signup ---- */
    builder
      .addCase(signupCustomer.pending, (state) => {
        state.user.status = "loading";
        state.user.error = null;
      })
      .addCase(signupCustomer.fulfilled, (state, action) => {
        state.user.status = "succeeded";
        state.user.pendingSignup = action.payload; // { email, mobile, passwordUsed }
      })
      .addCase(signupCustomer.rejected, (state, action) => {
        state.user.status = "failed";
        state.user.error =
          action.payload || action.error?.message || "Signup failed";
      });

    /* ---- verify OTP ---- */
    builder
      .addCase(verifySignupCode.pending, (state) => {
        state.user.verifyStatus = "loading";
        state.user.verifyError = null;
      })
      .addCase(verifySignupCode.fulfilled, (state) => {
        state.user.verifyStatus = "succeeded";
      })
      .addCase(verifySignupCode.rejected, (state, action) => {
        state.user.verifyStatus = "failed";
        state.user.verifyError =
          action.payload || action.error?.message || "Verification failed";
      });
  },
});

export const {
  setAppToken,
  clearAppToken,
  logout,
  setUserToken,
  setUserProfile,
} = authSlice.actions;

/* ===================== SELECTORS & HELPERS ===================== */

/** Best available token (prefers user, falls back to app token). */
export const selectBestToken = (state) => {
  const a = state?.auth || {};

  // Prefer logged-in user token
  if (a.user?.token) return a.user.token;

  // Legacy/fallback shapes (if you ever store differently)
  if (a.userToken) return a.userToken;
  if (a.customerToken) return a.customerToken;
  if (a.profile?.token) return a.profile.token;
  if (a.customer?.token) return a.customer.token;
  if (a.login?.token) return a.login.token;

  // Fall back to app token (nested in auth.app.token)
  if (a.app?.token) return a.app.token;

  // Flat fallback
  if (a.token) return a.token;
  if (a.appToken) return a.appToken;

  return null;
};

/** Normalized customer profile for UI forms. */
// selectors (simple + robust because you confirmed the path)
export const selectAuthProfile = (state) => {
  const p = state?.auth?.user?.profile || {};

  // name → first/last
  const fullName = p.name || "";
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/);
  const lastName = rest.join(" ");

  return {
    id: p.id ?? null,
    name: fullName,
    firstName,
    lastName,
    email: p.email || "",
    mobile: p.phone || p.mobile || "",
    dob: p.dob || p.dateOfBirth || "",
    gender: p.gender || "",
    nationality: p.nationality || "Bangladeshi",
    postalCode: p.postalCode || p.zip || "",
    _raw: p, // handy for debugging in DevTools
  };
};

export const selectAuthHeader = (state) => {
  const t = selectBestToken(state);
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const selectSignupPending = (s) => s.auth?.user?.pendingSignup || null;
export const selectVerifyState = (s) => ({
  status: s.auth?.user?.verifyStatus || "idle",
  error: s.auth?.user?.verifyError || null,
});
export const selectIsAuthenticated = (state) =>
  Boolean(state?.auth?.user?.token);
export const selectUser = (state) => state?.auth?.user?.profile || null;

export default authSlice.reducer;
