import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";
import Balance from "../models/Balance.js";

const transactionSchema = new mongoose.Schema({
  transactionid: { type: Number, unique: true },
  userId: { type: Number, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  timeAndDate: { 
    type: Date, 
    required: true,
    set: (value) => new Date(value), // String to Date conversion
  },
  createdAt: { type: Date, default: Date.now },
  adminId: { type: Number, ref: "Login" },
});

transactionSchema.plugin(AutoIncrement(mongoose.connection), { inc_field: "transactionid" });



// ✅ Middleware: Update balance when transaction is CREATED
transactionSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // Only run on new transactions

  let userBalance = await Balance.findOne({ userId: this.userId });

  if (!userBalance) {
    userBalance = new Balance({ userId: this.userId, adminId: this.adminId, balance: 0 });
  }

  if (this.type === "credit") {
    userBalance.balance += this.amount;
  } else if (this.type === "debit") {
    if (userBalance.balance < this.amount) return next(new Error("Insufficient balance"));
    userBalance.balance -= this.amount;
  }

  await userBalance.save();
  next();
});

// ✅ Middleware: Adjust balance when transaction is UPDATED
transactionSchema.pre("findOneAndUpdate", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery()); // Get old transaction
  if (!docToUpdate) return next(new Error("Transaction not found"));

  const { userId, amount, type } = docToUpdate; // Old transaction details
  const newAmount = this.getUpdate().amount; // New updated amount
  const newType = this.getUpdate().type; // New updated type

  let userBalance = await Balance.findOne({ userId });
  if (!userBalance) return next(new Error("Balance record not found"));

  // Reverse old transaction effect
  if (type === "credit") userBalance.balance -= amount;
  else if (type === "debit") userBalance.balance += amount;

  // Apply new transaction effect
  if (newType === "credit") userBalance.balance += newAmount;
  else if (newType === "debit") {
    if (userBalance.balance < newAmount) return next(new Error("Insufficient balance"));
    userBalance.balance -= newAmount;
  }

  await userBalance.save();
  next();
});

// ✅ Middleware: Adjust balance when transaction is DELETED
transactionSchema.pre("findOneAndDelete", async function (next) {
  const docToDelete = await this.model.findOne(this.getQuery()); // Get transaction to delete
  if (!docToDelete) return next(new Error("Transaction not found"));

  const { userId, amount, type } = docToDelete;

  let userBalance = await Balance.findOne({ userId });
  if (!userBalance) return next(new Error("Balance record not found"));

  // Reverse the transaction effect
  if (type === "credit") userBalance.balance -= amount;
  else if (type === "debit") userBalance.balance += amount;

  await userBalance.save();
  next();
});

export default mongoose.model("Transaction", transactionSchema);
