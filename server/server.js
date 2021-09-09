import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import golfRoutes from "./routes/golfRoutes.js";
import paymentRoutes from "./routes/paymentRroutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/golfs", golfRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
