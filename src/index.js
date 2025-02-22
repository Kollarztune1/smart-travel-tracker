import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());




 
 
const detectLocation = async (text) => {
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${API_KEY}`;

  try {
    const { data } = await axios.get(url);
    return data.predictions.length > 0 ? data.predictions[0].description : null;
  } catch (error) {
    console.error("❌ Location Detection Error:", error.message);
    return null;
  }
};


 
 
const convertTimeZone = async (time, location) => {
  const API_KEY = process.env.TIMEZONE_API_KEY;
  const url = `https://timeapi.io/api/Time/current/zone?timezone=${encodeURIComponent(location)}`;

  try {
    const { data } = await axios.get(url);
    return `${time} in ${location} is ${data.datetime}`;
  } catch (error) {
    console.error("❌ Time Zone Conversion Error:", error.message);
    return time;
  }
};


 
 
const convertCurrency = async (amount, from, to = "USD") => {
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`;

  try {
    const { data } = await axios.get(url);
    const rate = data.conversion_rates[to];
    return `${amount} ${from} ≈ ${(amount * rate).toFixed(2)} ${to}`;
  } catch (error) {
    console.error("❌ Currency Conversion Error:", error.message);
    return `${amount} ${from}`;
  }
};


 
 
app.post("/modify-message", async (req, res) => {
  try {
    console.log("Received request:", req.body);  

    const { message } = req.body;
    let modifiedMessage = message;

    
    const location = await detectLocation(message);
    if (location) modifiedMessage += ` 📍 (${location})`;

    
    if (message.match(/\d{1,2}\s?(AM|PM)\s?[A-Z]{2,}/)) {
      modifiedMessage += ` 🕒 (Time Zone Adjusted)`;
    }

    
    const currencyMatch = message.match(/(\d+)\s?(USD|EUR|GBP)/);
    if (currencyMatch) {
      const [_, amount, currency] = currencyMatch;
      const convertedAmount = await convertCurrency(parseFloat(amount), currency);
      modifiedMessage += ` 💱 (${convertedAmount})`;
    }

    res.json({ modifiedMessage });
  } catch (error) {
    console.error("❌ Message Processing Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






















