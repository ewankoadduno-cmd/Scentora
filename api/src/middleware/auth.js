const jwt = require("jsonwebtoken")
const User = require("../models/User")

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ""
    const token = header.startsWith("Bearer ") ? header.slice(7) : null

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub).select("-passwordHash")

    if (!user) {
      return res.status(401).json({ message: "Invalid session" })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" })
    }

    next()
  }
}

module.exports = { requireAuth, requireRole }
