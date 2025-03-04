import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection; // Get the Mongoose connection
const AutoIncrement = AutoIncrementFactory(connection); // Initialize AutoIncrement

const loginSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


// Apply the AutoIncrement plugin properly
loginSchema.plugin(AutoIncrement, { inc_field: "id" });

export default mongoose.model("Login", loginSchema);
