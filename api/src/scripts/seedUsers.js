const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const User = require("../models/User")

dotenv.config()

const demoUsers = [
  {
    name: "Scentora Admin",
    email: "admin@scentora.test",
    contactNumber: "0917 000 0001",
    password: "Admin123!",
    role: "admin",
  },
  {
    name: "Khristiane Cruz",
    email: "customer@scentora.test",
    contactNumber: "0917 000 0000",
    password: "Customer123!",
    role: "customer",
  },
]

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to api/.env before seeding.")
  }

  await mongoose.connect(process.env.MONGO_URI)

  for (const demoUser of demoUsers) {
    const passwordHash = await bcrypt.hash(demoUser.password, 12)
    await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        name: demoUser.name,
        email: demoUser.email,
        contactNumber: demoUser.contactNumber,
        passwordHash,
        role: demoUser.role,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
  }

  console.log(`Seeded ${demoUsers.length} users.`)
  await mongoose.disconnect()
}

seed().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
