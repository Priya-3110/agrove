// import { useState } from "react";
// import { api } from "../api/api";
// import "../styles.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await api.post("/auth/login", { email, password });
//      localStorage.setItem("token", res.data.token);
// localStorage.setItem("user", JSON.stringify(res.data.user));

//       window.location.href = "/";
//     } catch (err) {
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <form className="card" onSubmit={handleLogin}>
//         <h2 className="title">Farmer Login 🌾</h2>

//         {error && <p className="error">{error}</p>}

//         <input
//           className="input"
//           type="email"
//           placeholder="Email Address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           className="input"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button className="btn" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p style={{ textAlign: "center", marginTop: "10px" }}>
//           New user? <a href="/register">Register here</a>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { api } from "../api/api";
import "../styles.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer"); // 👈 NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        role, // 👈 send role
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (err) {
      setError("Invalid email, password, or role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleLogin}>
        <h2 className="title">
          Login as {role === "admin" ? "Admin 🛠️" : "Farmer 🌾"}
        </h2>

        {error && <p className="error">{error}</p>}

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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          New user? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
}
