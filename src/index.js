import express from "express";
import walletRoutes from "./routes/wallet.routes.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config();

const app = express();


app.use(express.json());

app.use("/api", walletRoutes);
app.use("/api", userRoutes);

db()

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;