import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.Redis || "redis://localhost:6379");
const QUEUE_KEY = "queue:emails";
app.post("/email", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    content: req.body.content || "No Content",
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({ success: true,job });
});

app.get('/email/process-one',async (req,res) => {
    const raw_job = await redis.rpop(QUEUE_KEY);
    if(!raw_job){
        return res.status(400).json({success:false,messege:"No job found"});
    }
    res.json({job:JSON.parse(raw_job)})
});

app.listen(3000,()=>{
    console.log('server is listening on port 3000');
})