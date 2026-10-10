const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Product = require("../models/Product")
const seedProducts = require("../data/seedProducts")

dotenv.config()

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to api/.env before seeding.")
  }

  await mongoose.connect(process.env.MONGO_URI)

  for (const product of seedProducts) {
    await Product.findOneAndUpdate(
      { slug: product.slug },
      product,
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
  }

  console.log(`Seeded ${seedProducts.length} products.`)
  await mongoose.disconnect()
}

seed().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
