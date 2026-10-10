const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3000/api"

async function orderRequest(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Order request failed")
  }

  return data
}

export function createOrder(payload, token) {
  return orderRequest("/orders", token, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function fetchMyOrders(token) {
  return orderRequest("/orders/my", token)
}

export function fetchAllOrders(token) {
  return orderRequest("/orders", token)
}

export function fetchOrder(orderNumber, token) {
  return orderRequest(`/orders/${orderNumber}`, token)
}

export function updateOrderStatus(orderNumber, payload, token) {
  return orderRequest(`/orders/${orderNumber}/status`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function cancelOrder(orderNumber, token) {
  return orderRequest(`/orders/${orderNumber}/cancel`, token, {
    method: "PATCH",
  })
}
