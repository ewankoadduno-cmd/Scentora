const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    contactNumber: user.contactNumber,
    role: user.role,
    address: user.address,
  }
}

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, contactNumber = "", password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, contactNumber, passwordHash, role: "customer" })

    res.status(201).json({
      token: signToken(user),
      user: sanitizeUser(user),
    })
  } catch (error) {
    next(error)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const matches = await bcrypt.compare(password, user.passwordHash)
    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    res.json({
      token: signToken(user),
      user: sanitizeUser(user),
    })
  } catch (error) {
    next(error)
  }
})

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) })
})

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const { name, contactNumber, address = {} } = req.body || {}

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" })
    }

    req.user.name = name.trim()
    req.user.contactNumber = contactNumber?.trim() || ""
    req.user.address = {
      street: address.street?.trim() || "",
      city: address.city?.trim() || "",
      province: address.province?.trim() || "",
    }

    await req.user.save()

    res.json({ user: sanitizeUser(req.user) })
  } catch (error) {
    next(error)
  }
})

module.exports = router
