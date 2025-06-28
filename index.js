import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
// import { startWhatsAppSession  } from "./config/whatsappHelper.js";

const app = express();
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // 👈 for form submissions

app.use(cors(
    {
        origin:true,
        credentials:true,
    }
));

connectDB(); // Connect to MongoDB

// startWhatsAppSession();


// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", loginRoutes);
app.use("/api/contact", contactRoutes); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
