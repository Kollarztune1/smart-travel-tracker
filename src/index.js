import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { integrationSpec } from "./integrationspec.js";
import cors from "cors";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



app.get("/telex/spec", (req, res) => {
  res.json(integrationSpec);
});
 
 
const detectLocation = async (text) => {
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${API_KEY}`;

  try {
    const { data } = await axios.get(url);
    if (data.predictions.length > 0) {
      const fullLocation = data.predictions[0].description;

      
      const locationParts = fullLocation.split(",").map(part => part.trim());
      const filteredLocation = locationParts.slice(-2).join(", "); 

      return filteredLocation; 
    }
    return null;
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

app.get("/telex/auth", (req, res) => {
  const apiKey = req.query.api_key;
  if (!apiKey) {
      return res.status(400).json({ error: "Missing API Key" });
  }

  
  process.env.TELEX_API_KEY = apiKey;

  res.json({ message: "Telex authentication successful!", apiKey });
});

app.post("/telex/webhook", (req, res) => {
  console.log("🔔 Received Telex Webhook:", req.body);
  
  
  res.status(200).json({ message: "Webhook received successfully!" });
});

app.post("/modify-message", async (req, res) => {
  try {
    console.log(`📩 Received ${req.method} request at ${req.url}`);
    console.log("📄 Request body:", req.body);

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

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






















