import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Navbar() {
  const navigate = useNavigate();

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

  return (
    <div className="navbar">
      <div className="brand" onClick={() => navigate("/")}>
        🌱 AGROVE
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        {/* 🛡️ ADMIN ONLY */}
        {user?.role === "admin" && (
          <button
            className="btn"
            onClick={() => navigate("/admin/advisory")}
          >
            Admin Advisory
          </button>
        )}

        {/* 👨‍🌾 FARMER ONLY */}
        {user?.role === "farmer" && (
          <>
            <button className="btn" onClick={() => navigate("/")}>
              Dashboard
            </button>

            <button className="btn" onClick={() => navigate("/farms")}>
              Farms
            </button>

            <button className="btn" onClick={() => navigate("/advisory")}>
              Advisory
            </button>
          </>
        )}

        <button className="btn logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
