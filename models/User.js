import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const userSchema = new mongoose.Schema({
  uid: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String},
  phone: { type: String,unique: true, required: true },
  location: { type: String, required: true },
  adminId: { type: Number, ref: "Login" },
});

userSchema.plugin(AutoIncrement(mongoose), { inc_field: "uid" });
export default mongoose.model("User", userSchema); 