const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contactNumber: { type: String, trim: true, default: "" },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      province: { type: String, default: "" },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
