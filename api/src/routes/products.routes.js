const express = require("express")
const Product = require("../models/Product")
const { requireAuth, requireRole } = require("../middleware/auth")

const router = express.Router()

function serializeProduct(product) {
  const plain = product.toObject()
  return {
    ...plain,
    id: plain.slug,
    _id: plain._id.toString(),
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function productPayload(body) {
  const slug = body.slug || slugify(`${body.brand || ""} ${body.name || ""}`)

  return {
    slug,
    brand: body.brand,
    name: body.name,
    category: body.category,
    size: body.size,
    price: Number(body.price),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
    stock: Number(body.stock ?? 0),
    badge: body.badge || null,
    family: body.family,
    image: body.image,
    description: body.description,
    notes: body.notes || { top: [], middle: [], base: [] },
    accords: body.accords || [],
    isActive: body.isActive ?? true,
  }
}

function validateProductPayload(payload) {
  const required = ["slug", "brand", "name", "category", "size", "price", "family", "image", "description"]
  const missing = required.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "")

  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`
  }

  if (Number.isNaN(payload.price) || payload.price < 0) {
    return "Price must be a valid number"
  }

  if (Number.isNaN(payload.stock) || payload.stock < 0) {
    return "Stock must be a valid number"
  }

  return null
}

router.get("/", async (req, res, next) => {
  try {
    const { search, category, family, sort = "newest" } = req.query
    const filter = { isActive: true }

    if (category) filter.category = category
    if (family) filter.family = family
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { family: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ]
    }

    const sortMap = {
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      newest: { createdAt: -1 },
    }

    const products = await Product.find(filter).sort(sortMap[sort] || sortMap.newest)
    res.json(products.map(serializeProduct))
  } catch (error) {
    next(error)
  }
})

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(serializeProduct(product))
  } catch (error) {
    next(error)
  }
})

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const payload = productPayload(req.body)
    const error = validateProductPayload(payload)

    if (error) return res.status(400).json({ message: error })

    const existing = await Product.findOne({ slug: payload.slug })
    if (existing) return res.status(409).json({ message: "Product slug already exists" })

    const product = await Product.create(payload)
    res.status(201).json(serializeProduct(product))
  } catch (error) {
    next(error)
  }
})

router.put("/:slug", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const payload = productPayload(req.body)
    const error = validateProductPayload(payload)

    if (error) return res.status(400).json({ message: error })

    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      payload,
      { new: true, runValidators: true }
    )

    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(serializeProduct(product))
  } catch (error) {
    next(error)
  }
})

router.patch("/:slug/stock", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const stock = Number(req.body.stock)

    if (Number.isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Stock must be a valid number" })
    }

    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { stock },
      { new: true, runValidators: true }
    )

    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(serializeProduct(product))
  } catch (error) {
    next(error)
  }
})

router.delete("/:slug", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { isActive: false },
      { new: true }
    )

    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product deactivated", product: serializeProduct(product) })
  } catch (error) {
    next(error)
  }
})

module.exports = router
