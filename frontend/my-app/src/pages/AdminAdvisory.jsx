import { useEffect, useState } from "react";
import { api } from "../api/api";
import "../styles.css";

export default function AdminAdvisory() {
  const [advisories, setAdvisories] = useState([]);
  const [form, setForm] = useState({
    crop: "",
    soil: "",
    title: "",
    content: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get("/advisory").then((res) => setAdvisories(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const res = await api.put(`/advisory/${editingId}`, form);
      setAdvisories(
        advisories.map((a) => (a._id === editingId ? res.data : a))
      );
      setEditingId(null);
    } else {
      const res = await api.post("/advisory", form);
      setAdvisories([res.data, ...advisories]);
    }

    setForm({ crop: "", soil: "", title: "", content: "" });
  };

  const edit = (a) => {
    setEditingId(a._id);
    setForm(a);
  };

  const remove = async (id) => {
    await api.delete(`/advisory/${id}`);
    setAdvisories(advisories.filter((a) => a._id !== id));
  };

  return (
    <div className="container">
      <h2 className="title">Admin – Advisory Panel 🛡️</h2>

      <form className="card" onSubmit={submit}>
        <input className="input" name="crop" placeholder="Crop" value={form.crop} onChange={handleChange} required />
        <input className="input" name="soil" placeholder="Soil Type" value={form.soil} onChange={handleChange} required />
        <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea className="input" name="content" placeholder="Advisory Content" value={form.content} onChange={handleChange} rows="3" required />
        <button className="btn">{editingId ? "Update Advisory" : "Add Advisory"}</button>
      </form>

      {advisories.map((a) => (
        <div className="card" key={a._id}>
          <h3>{a.title}</h3>
          <p>{a.crop} | {a.soil}</p>
          <p>{a.content}</p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn" onClick={() => edit(a)}>Edit</button>
            <button className="btn logout" onClick={() => remove(a._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
