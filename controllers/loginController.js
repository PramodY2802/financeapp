import Login from "../models/Login.js";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Login.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userData = {
      id: user.id,
      username: user.username,
    };

    
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getuser = async (req, res) => {
  try {
    const user = await Login.findById(req.params.id);
    res.json({ exists: !!user }); // Returns { exists: true } if user exists, otherwise { exists: false }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Received request:", req.body); // Log request body

    // Check if username already exists
    const existingUser = await Login.findOne({ username });
    if (existingUser) {
      console.log("Username already exists");
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Create a new user
    const newUser = new Login({ username, password: hashedPassword });

    // Save the user
    await newUser.save();
    console.log("User registered successfully");

    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ error: error.message });
  }
};
