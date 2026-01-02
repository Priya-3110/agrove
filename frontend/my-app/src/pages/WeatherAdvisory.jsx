import { useState } from "react";
import axios from "axios";

const WeatherAdvisory = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);

  const fetchWeather = async () => {
    if (!city) {
      alert("Please enter city name");
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/api/weather/${city}`
    );
    setData(res.data);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🌦️ Weather Based Advisory</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Enter city (e.g. Pune)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button style={styles.button} onClick={fetchWeather}>
          Check Weather
        </button>

        {data && (
          <div style={styles.result}>
            <p><b>City:</b> {data.city}</p>
            <p><b>Temperature:</b> {data.temperature} °C</p>
            <p><b>Condition:</b> {data.condition}</p>
            <p style={styles.advisory}>{data.advisory}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e8f5e9, #f1f8e9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, Tahoma, sans-serif"
  },
  card: {
    background: "#ffffff",
    width: "420px",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  heading: {
    textAlign: "center",
    color: "#2e7d32",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "15px"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2e7d32",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },
  result: {
    marginTop: "20px",
    background: "#f9fbe7",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "15px"
  },
  advisory: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#33691e"
  }
};

export default WeatherAdvisory;
