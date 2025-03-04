import express from "express";
import {
  registerUser,
  getUsers,
  getUsersByAdmin,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Create a new user
router.post("/register", registerUser);

// Get all users
router.get("/all", getUsers);

// Get a single user by ID
router.get("/", getUsersByAdmin);

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
