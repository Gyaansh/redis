import Redis from "ioredis";
import express from "express";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.listen(3000, async () => {
  console.log("Server is listening on port 3000");
});

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ reply: reply });
});
const BANNER_KEY = "app:banner";
app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.msg || "Welcome to chai aur redis!");
  res.json({ success: true });
});

app.get("/banner", async (req, res) => {
  const msg = await redis.get(BANNER_KEY);
  res.json({ msg });
});

app.delete("/banner", async (req, res) => {
  await redis.delete(BANNER_KEY);
  res.json({ success: true });
});

app.get("/banner/exist",async (req,res) => {
    const exist = await redis.exists(BANNER_KEY)
    
    res.json({success: (exist)})
})