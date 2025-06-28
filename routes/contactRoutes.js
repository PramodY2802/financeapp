import express from "express";
const router = express.Router();

// Import Model
import Contact from "../models/contactModel.js";

// @route POST /api/contact
router.post("/", async (req, res) => {
  try {
    console.log("Request body =>", req.body);
    
    const { name, email, subject, message } = req.body;

    // Optional validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
