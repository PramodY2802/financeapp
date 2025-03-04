import express from "express";
import { addTransaction, getTransactionsByAdmin,updateTransaction,deleteTransaction,viewBalance } from "../controllers/transactionController.js";
const router = express.Router();


router.post("/add", addTransaction);
router.get("/", getTransactionsByAdmin);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
router.get("/all",viewBalance);




export default router;