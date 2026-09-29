import Redis from "ioredis";
import express from "express";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.listen(3000, async () => {
  console.log("Server is listening on port 3000");
});

function otpkey(phone){
    return `otp:${phone}`;
}

app.post("/otp",async (req,res) => {
    const {phone} = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
    redis.set(otpkey(phone),otp,'EX',30);//otp valid only for 30 seconds
    res.json({messege:"OTP sent",otp});
})

app.post("/otp/verify",async (req,res) => {
    const {phone , otp} = req.body;
    const savedOtp = await redis.get(otpkey(phone));

    if(!savedOtp){
        return res.status(400).json({Message:"OTP expired or not found"})
    }
    else if(savedOtp !== otp){
        return res.status(400).json({Message:"OTP Invalid!"})
    }
    res.json({Message:"OTP verified"})
})

app.get('/otp/:phone/ttl',async (req,res) => {
  const {phone} = req.params;
  const ttl = await redis.ttl(otpkey(phone));
  res.json({ttl});
})