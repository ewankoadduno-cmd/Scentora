import { products as fallbackProducts, getProduct as getFallbackProduct } from "../data/catalog"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3000/api"

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })

  const url = `${API_BASE_URL}/products${query.toString() ? `?${query}` : ""}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Unable to load products")
  }

  return response.json()
}

export async function fetchProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`)

  if (!response.ok) {
    throw new Error("Unable to load product")
  }

  return response.json()
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

async function productMutation(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: authHeaders(token),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Product request failed")
  }

  return data
}

export function createProduct(product, token) {
  return productMutation("/products", token, {
    method: "POST",
    body: JSON.stringify(product),
  })
}

export function updateProduct(slug, product, token) {
  return productMutation(`/products/${slug}`, token, {
    method: "PUT",
    body: JSON.stringify(product),
  })
}

export function updateProductStock(slug, stock, token) {
  return productMutation(`/products/${slug}/stock`, token, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  })
}

export function deleteProduct(slug, token) {
  return productMutation(`/products/${slug}`, token, {
    method: "DELETE",
  })
}

export function getFallbackProducts() {
  return fallbackProducts
}

export function getFallbackProductById(productId) {
  return getFallbackProduct(productId)
}
