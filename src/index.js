import Redis from "ioredis";
import express from "express";
import mongoose from "mongoose";

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
mongoose.connect("mongodb://127.0.0.1:27017/chai_aur_redis");

app.listen(3000, async () => {
  console.log("Server is listening on port 3000");
});

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ reply: reply });
});

app.get("/mongo", async (req, res) => {
  res.json({ status: "connected", connection_name: mongoose.connection.name });
});

