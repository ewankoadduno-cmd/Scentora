const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
  {
    top: { type: [String], default: [] },
    middle: { type: [String], default: [] },
    base: { type: [String], default: [] },
  },
  { _id: false }
)

const accordSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pct: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Men", "Women", "Unisex", "Body Mist", "Perfume Oil", "Gift Sets"] },
    size: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    badge: { type: String, default: null },
    family: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    notes: { type: noteSchema, default: () => ({}) },
    accords: { type: [accordSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

productSchema.index({ name: "text", brand: "text", family: "text", description: "text" })

module.exports = mongoose.model("Product", productSchema)
