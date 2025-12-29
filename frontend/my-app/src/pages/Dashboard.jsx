import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../styles.css";

/* Register chart components */
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [farmCount, setFarmCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [activityStats, setActivityStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    api.get("/farms/count").then((res) =>
      setFarmCount(res.data.count)
    );

    api.get("/activities/count/all").then((res) =>
      setActivityCount(res.data.count)
    );

    api.get("/activities/stats/types").then((res) =>
      setActivityStats(res.data)
    );

    api.get("/activities/recent").then((res) =>
      setRecentActivities(res.data)
    );
  }, []);

  const chartData = {
    labels: activityStats.map((s) => s._id),
    datasets: [
      {
        label: "Activity Distribution",
        data: activityStats.map((s) => s.count),
        backgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <div className="container">
      <h2 className="title">Dashboard 📊</h2>

      {/* KPI CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>Total Farms</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            🌾 {farmCount}
          </p>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Total Activities</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            🚜 {activityCount}
          </p>
        </div>
      </div>

      {/* ACTIVITY DISTRIBUTION CHART */}
      <div className="card">
        <h3>Activity Distribution</h3>
        <Bar data={chartData} />
      </div>

      {/* RECENT ACTIVITIES */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3>Recent Activities</h3>

        {recentActivities.length === 0 && (
          <p>No recent activities.</p>
        )}

        {recentActivities.map((a) => (
          <p key={a._id}>
            🚜 {a.type} on{" "}
            {new Date(a.date).toDateString()}
          </p>
        ))}
      </div>
    </div>
  );
}
