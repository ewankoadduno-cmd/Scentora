const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    slug: { type: String, required: true },
    brand: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const deliverySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    delivery: { type: deliverySchema, required: true },
    paymentMethod: { type: String, required: true, enum: ["Cash on Delivery", "GCash / Bank Transfer"] },
    paymentStatus: { type: String, default: "Pending", enum: ["Pending", "Awaiting proof", "Paid", "Rejected"] },
    status: { type: String, default: "Pending", enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)
