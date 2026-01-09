import { useState } from "react";
import { api } from "../api/api";
import "../styles.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer"); // 👈 NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role, // 👈 send role
      });

      setSuccess("Registration successful. Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("farmer");
    } catch (err) {
      setError("User already exists or invalid data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleRegister}>
        <h2 className="title">
          Register as {role === "admin" ? "Admin 🛠️" : "Farmer 🌱"}
        </h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {/* ROLE SELECTION */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ marginRight: "15px" }}>
            <input
              type="radio"
              name="role"
              value="farmer"
              checked={role === "farmer"}
              onChange={() => setRole("farmer")}
            />{" "}
            Farmer
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />{" "}
            Admin
          </label>
        </div>

        <input
          className="input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
