import express from "express";
import { loginUser,registerUser,getuser } from "../controllers/loginController.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/reg", registerUser);
router.get("/:id", getuserid);


export default router;
