import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  return (
    <div className="navbar">
      {/* Brand */}
      <div className="brand" onClick={() => navigate("/")}>
        🌱 AGROVE
      </div>

      {/* Hamburger (Mobile) */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* Links */}
      <div className={`nav-links ${open ? "open" : ""}`}>
        {/* 🛡️ ADMIN */}
        {user?.role === "admin" && (
          <NavLink
            to="/admin/advisory"
            className="btn"
            onClick={closeMenu}
          >
            Admin Advisory
          </NavLink>
        )}

        {/* 👨‍🌾 FARMER */}
        {user?.role === "farmer" && (
          <>
            <NavLink to="/" className="btn" onClick={closeMenu}>
              Dashboard
            </NavLink>

            <NavLink to="/farms" className="btn" onClick={closeMenu}>
              Farms
            </NavLink>

            <NavLink to="/advisory" className="btn" onClick={closeMenu}>
              Advisory
            </NavLink>

            <NavLink to="/weather" className="btn" onClick={closeMenu}>
              Weather Advisory
            </NavLink>
          </>
        )}

        <button className="btn logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
