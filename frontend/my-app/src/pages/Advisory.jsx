import { useState } from "react";
import { api } from "../api/api";
import "../styles.css";

export default function Advisory() {
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [advice, setAdvice] = useState([]);

  const fetchAdvisory = async () => {
    const res = await api.get(`/advisory?crop=${crop}&soil=${soil}`);
    setAdvice(res.data);
  };

  return (
    <div className="container">
      <h2 className="title">Advisory Hub 🌿</h2>

      <div className="card">
        <select className="input" onChange={(e) => setCrop(e.target.value)}>
          <option value="">Select Crop</option>
          <option>Wheat</option>
          <option>Rice</option>
          <option>Cotton</option>
        </select>

        <select className="input" onChange={(e) => setSoil(e.target.value)}>
          <option value="">Select Soil</option>
          <option>Black</option>
          <option>Red</option>
          <option>Loamy</option>
        </select>

        <button className="btn" onClick={fetchAdvisory}>
          Get Advisory
        </button>
      </div>

      {advice.map((a) => (
        <div className="card" key={a._id}>
          <h3>{a.title}</h3>
          <p>{a.content}</p>
        </div>
      ))}
    </div>
  );
}
