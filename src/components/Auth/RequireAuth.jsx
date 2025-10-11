// src/components/auth/RequireAuth.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";

export default function RequireAuth({ children }) {
  const isAuthed = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/sign" replace state={{ from: location.pathname }} />;
  }
  return children;
}
