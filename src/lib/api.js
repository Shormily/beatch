import { store } from "../redux/store";

export async function apiFetch(path, options = {}) {
  const state = store.getState();
  const customerToken = state?.auth?.customerToken;
  const appToken = state?.auth?.appToken;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");

  if (customerToken) headers.set("Authorization", `Bearer ${customerToken}`);
  else if (appToken) headers.set("Authorization", `Bearer ${appToken}`);

  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
