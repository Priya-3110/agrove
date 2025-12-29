import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}
