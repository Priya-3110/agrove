import { useState } from "react";
import { api } from "../api/api";
import "../styles.css";

export default function Advisory() {
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [advice, setAdvice] = useState([]);

  const fetchAdvisory = async () => {
    if (!crop || !soil) {
      alert("Please enter both crop and soil type");
      return;
    }

    const res = await api.get(`/advisory?crop=${crop}&soil=${soil}`);
    setAdvice(res.data);
  };

  return (
    <div className="container">
      <h2 className="title">Advisory Hub 🌿</h2>

      <div className="card">
        <input
          className="input"
          type="text"
          placeholder="Enter Crop (e.g. Wheat)"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Enter Soil Type (e.g. Black)"
          value={soil}
          onChange={(e) => setSoil(e.target.value)}
        />

        <button className="btn" onClick={fetchAdvisory}>
          Get Advisory
        </button>
      </div>

      {advice.length === 0 && (
        <p style={{ textAlign: "center" }}>No advisory found</p>
      )}

      {advice.map((a) => (
        <div className="card" key={a._id}>
          <h3>{a.title}</h3>
          <p>{a.content}</p>
        </div>
      ))}
    </div>
  );
}
