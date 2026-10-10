const express = require("express")
const mongoose = require("mongoose")
const Order = require("../models/Order")
const Product = require("../models/Product")
const { requireAuth, requireRole } = require("../middleware/auth")

const router = express.Router()
const SHIPPING_FEE = 120

function serializeOrder(order) {
  const plain = order.toObject()

  return {
    ...plain,
    id: plain.orderNumber,
    _id: plain._id.toString(),
    user: plain.user?.toString?.() || plain.user,
  }
}

function makeOrderNumber() {
  const segment = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 900 + 100)
  return `SCN-${segment}${random}`
}

router.post("/", requireAuth, async (req, res, next) => {
  const session = await mongoose.startSession()

  try {
    const { items = [], delivery, paymentMethod = "Cash on Delivery" } = req.body

    if (!items.length) return res.status(400).json({ message: "Cart is empty" })
    if (!delivery?.name || !delivery?.address || !delivery?.city || !delivery?.province || !delivery?.contactNumber) {
      return res.status(400).json({ message: "Complete delivery details are required" })
    }

    let createdOrder

    await session.withTransaction(async () => {
      const orderItems = []

      for (const item of items) {
        const product = await Product.findOne({ slug: item.productId, isActive: true }).session(session)
        const quantity = Number(item.quantity)

        if (!product) throw new Error(`Product not found: ${item.productId}`)
        if (!quantity || quantity < 1) throw new Error("Invalid item quantity")
        if (product.stock < quantity) throw new Error(`${product.name} does not have enough stock`)

        product.stock -= quantity
        await product.save({ session })

        orderItems.push({
          product: product._id,
          slug: product.slug,
          brand: product.brand,
          name: product.name,
          image: product.image,
          size: product.size,
          price: product.price,
          quantity,
        })
      }

      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const paymentStatus = paymentMethod === "Cash on Delivery" ? "Pending" : "Awaiting proof"

      const [order] = await Order.create([{
        orderNumber: makeOrderNumber(),
        user: req.user._id,
        customerName: req.user.name,
        customerEmail: req.user.email,
        items: orderItems,
        delivery,
        paymentMethod,
        paymentStatus,
        subtotal,
        shippingFee: SHIPPING_FEE,
        total: subtotal + SHIPPING_FEE,
      }], { session })

      createdOrder = order
    })

    res.status(201).json(serializeOrder(createdOrder))
  } catch (error) {
    const status = error.message?.includes("stock") || error.message?.includes("Product") || error.message?.includes("quantity") ? 400 : 500
    res.status(status).json({ message: error.message || "Unable to place order" })
  } finally {
    await session.endSession()
  }
})

router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders.map(serializeOrder))
  } catch (error) {
    next(error)
  }
})

router.get("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders.map(serializeOrder))
  } catch (error) {
    next(error)
  }
})

router.get("/:orderNumber", requireAuth, async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
    if (!order) return res.status(404).json({ message: "Order not found" })

    const isOwner = order.user.toString() === req.user._id.toString()
    if (!isOwner && req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" })

    res.json(serializeOrder(order))
  } catch (error) {
    next(error)
  }
})

router.patch("/:orderNumber/status", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const update = {}
    if (req.body.status) update.status = req.body.status
    if (req.body.paymentStatus) update.paymentStatus = req.body.paymentStatus

    const order = await Order.findOneAndUpdate(
      { orderNumber: req.params.orderNumber },
      update,
      { new: true, runValidators: true }
    )

    if (!order) return res.status(404).json({ message: "Order not found" })
    res.json(serializeOrder(order))
  } catch (error) {
    next(error)
  }
})

router.patch("/:orderNumber/cancel", requireAuth, async (req, res, next) => {
  const session = await mongoose.startSession()

  try {
    let cancelledOrder

    await session.withTransaction(async () => {
      const order = await Order.findOne({ orderNumber: req.params.orderNumber }).session(session)
      if (!order) {
        const error = new Error("Order not found")
        error.status = 404
        throw error
      }
      if (order.user.toString() !== req.user._id.toString()) {
        const error = new Error("Forbidden")
        error.status = 403
        throw error
      }
      if (order.status !== "Pending") {
        const error = new Error("Only pending orders can be cancelled")
        error.status = 400
        throw error
      }

      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
          { session }
        )
      }

      order.status = "Cancelled"
      await order.save({ session })
      cancelledOrder = order
    })

    res.json(serializeOrder(cancelledOrder))
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message })
    next(error)
  } finally {
    await session.endSession()
  }
})

module.exports = router
