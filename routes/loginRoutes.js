import express from "express";
import { loginUser,registerUser,getuser } from "../controllers/loginController.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/reg", registerUser);
router.post("/", getuser);


export default router;
