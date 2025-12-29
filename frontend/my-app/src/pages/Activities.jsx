import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "../styles.css";

export default function Activities() {
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    type: "",
    date: "",
    notes: "",
  });
  const exportActivitiesCSV = async () => {
  try {
    const res = await api.get(
      `/activities/export/csv/${farmId}`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "activities.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Failed to export activities CSV");
  }
};

  const [editingId, setEditingId] = useState(null);

  // Fetch activities
  useEffect(() => {
    api.get(`/activities/${farmId}`).then((res) => {
      setActivities(res.data);
    });
  }, [farmId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add or Update activity
  const submitActivity = async (e) => {
    e.preventDefault();

    if (editingId) {
      const res = await api.put(`/activities/${editingId}`, form);
      setActivities(
        activities.map((a) => (a._id === editingId ? res.data : a))
      );
      setEditingId(null);
    } else {
      const res = await api.post(`/activities/${farmId}`, form);
      setActivities([res.data, ...activities]);
    }

    setForm({ type: "", date: "", notes: "" });
  };

  const editActivity = (activity) => {
    setEditingId(activity._id);
    setForm({
      type: activity.type,
      date: activity.date.split("T")[0],
      notes: activity.notes || "",
    });
  };

  const deleteActivity = async (id) => {
    await api.delete(`/activities/${id}`);
    setActivities(activities.filter((a) => a._id !== id));
  };

  return (
    <div className="container">
      <h2 className="title">Farm Activities 🚜</h2>
      <button
        className="btn"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate("/farms")}
        >
        ← Back to Farms
        </button>

        <button
  className="btn"
  style={{ marginBottom: "20px" }}
  onClick={exportActivitiesCSV}
>
  ⬇️ Export Activities CSV
</button>

      {/* ================= ADD ACTIVITY SECTION ================= */}
      <div className="card">
        <h3 style={{ marginBottom: "12px" }}>
          {editingId ? "Edit Activity" : "Add Activity"}
        </h3>

        <form onSubmit={submitActivity}>
          <select
            className="input"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Activity Type</option>
            <option value="Sowing">Sowing</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Pesticide">Pesticide</option>
            <option value="Harvest">Harvest</option>
            <option value="Other">Other</option>
          </select>

          <input
            className="input"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <textarea
            className="input"
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows="3"
          />

          <button className="btn">
            {editingId ? "Update Activity" : "Add Activity"}
          </button>
        </form>
      </div>

      {/* ================= ACTIVITIES LIST SECTION ================= */}
      <h3 style={{ margin: "30px 0 10px" }}>Activity History</h3>

      {activities.length === 0 && (
        <p>No activities added yet.</p>
      )}

      {activities.map((a) => (
        <div className="card" key={a._id}>
          <h4>{a.type}</h4>
          <p>📅 {new Date(a.date).toDateString()}</p>
          {a.notes && <p>📝 {a.notes}</p>}

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn" onClick={() => editActivity(a)}>
              Edit
            </button>

            <button
              className="btn logout"
              onClick={() => deleteActivity(a._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
