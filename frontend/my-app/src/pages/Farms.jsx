import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "../styles.css";

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [activityCounts, setActivityCounts] = useState({});
  const [form, setForm] = useState({
    name: "",
    area: "",
    crop: "",
    soil: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const exportFarmsCSV = async () => {
  try {
    const res = await api.get("/farms/export/csv", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "farms.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Failed to export CSV");
  }
};


  // Fetch farms + activity counts
 useEffect(() => {
  api.get("/farms").then((res) => {
    setFarms(res.data);

    const counts = {};
    Promise.all(
      res.data.map((farm) =>
        api.get(`/activities/count/${farm._id}`).then((r) => {
          counts[farm._id] = r.data.count;
        })
      )
    ).then(() => {
      setActivityCounts(counts);
    });
  });
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addFarm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/farms", form);
      setFarms((prev) => [...prev, res.data]);
      setForm({ name: "", area: "", crop: "", soil: "" });
    } finally {
      setLoading(false);
    }
  };

  const deleteFarm = async (id) => {
    await api.delete(`/farms/${id}`);
    setFarms((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div className="container">
      <h2 className="title">My Farms 🌾</h2>

      {/* ADD FARM */}
      <form className="card" onSubmit={addFarm}>
        <input
          className="input"
          name="name"
          placeholder="Farm Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          name="area"
          type="number"
          placeholder="Area (hectares)"
          value={form.area}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          name="crop"
          placeholder="Crop"
          value={form.crop}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          name="soil"
          placeholder="Soil Type"
          value={form.soil}
          onChange={handleChange}
          required
        />

        <button className="btn" disabled={loading}>
          {loading ? "Adding..." : "Add Farm"}
        </button>
      </form>

      <button
  className="btn"
  style={{ marginTop: "20px" }}
  onClick={exportFarmsCSV}
>
  ⬇️ Export Farms CSV
</button>



      {/* FARM LIST */}
      <h3 style={{ marginTop: "40px" }}>Your Farms</h3>

      {farms.length === 0 && <p>No farms added yet.</p>}

      {farms.map((farm) => (
        <div className="card" key={farm._id}>
          <h3>{farm.name}</h3>

          <p>
            🌱 {farm.crop} | 📏 {farm.area} ha | 🪨 {farm.soil}
          </p>

          <p style={{ fontWeight: "bold", marginTop: "6px" }}>
            🚜 Activities: {activityCounts[farm._id] ?? 0}
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className="btn"
              onClick={() => navigate(`/activities/${farm._id}`)}
            >
              View Activities
            </button>

            <button
              className="btn logout"
              onClick={() => deleteFarm(farm._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
