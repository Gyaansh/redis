import express from "express";
import { emailQueue } from "./queue.js";
// import Redis from "ioredis";
const app = express();
app.use(express.json());
// const redis = new Redis(process.env.Redis || "redis://localhost:6379");

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

app.post("/welcome", async (req, res) => {
    const job = emailQueue.add(
        "send-welcome-email",
        {
        to: req.body.to,
        name: req.body.name || "learner",
        },
        {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        },
    );
    res.json({message:"Welcome email job added to the queue",jobId:job.id})

});
