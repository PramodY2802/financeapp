import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
// import { startWhatsAppSession  } from "./config/whatsappHelper.js";

const app = express();
app.use(express.json());
app.use(cors());

connectDB(); // Connect to MongoDB

// startWhatsAppSession();


// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", loginRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));