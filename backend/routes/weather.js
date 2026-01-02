const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const weather = response.data;

    let advisory = "";

    const temp = weather.main.temp;
    const rain = weather.weather[0].main;
    const wind = weather.wind.speed;

    if (rain === "Rain") {
      advisory = "🌧️ Rain expected. Avoid irrigation and spraying.";
    } else if (temp > 35) {
      advisory = "☀️ High temperature. Increase watering and avoid midday work.";
    } else if (wind > 10) {
      advisory = "🌬️ Strong winds. Delay spraying activities.";
    } else {
      advisory = "🌤️ Weather is favorable. Good day for farm activities.";
    }

    res.json({
      city,
      temperature: temp,
      condition: rain,
      advisory
    });

  } catch (error) {
    res.status(500).json({ message: "Weather data not available" });
  }
});

module.exports = router;
