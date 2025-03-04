import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const balanceSchema = new mongoose.Schema({
  balanceId: { type: Number, unique: true },
  userId: { type: Number, ref: "User", required: true }, // User कडून reference
  adminId: { type: Number, ref: "Login", required: true }, // Admin reference
  balance: { type: Number, default: 0, required: true }, // User चा बॅलन्स
});


// Auto-increment field
balanceSchema.plugin(AutoIncrement(mongoose.connection), { inc_field: "balanceId" });

export default mongoose.model("Balance", balanceSchema);
