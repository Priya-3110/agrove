import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Farms from "./pages/Farms";
import Activities from "./pages/Activities";
import Advisory from "./pages/Advisory";
import AdminRoute from "./components/AdminRoute";
import AdminAdvisory from "./pages/AdminAdvisory";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/farms" element={<ProtectedRoute><Farms /></ProtectedRoute>} />
        <Route
          path="/activities/:farmId"
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisory"
          element={
            <ProtectedRoute>
              <Advisory />
            </ProtectedRoute>
          }
        />
           <Route
  path="/admin/advisory"
  element={
    <AdminRoute>
      <AdminAdvisory />
    </AdminRoute>
  }
/>



      </Routes>
    </BrowserRouter>
  );
}
