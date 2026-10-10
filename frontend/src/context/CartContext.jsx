import { useEffect, useMemo, useState } from "react"
import { CartContext } from "./cart"

const CART_KEY = "scentora_cart"

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      }

      return [
        ...current,
        {
          productId: product.id,
          brand: product.brand,
          name: product.name,
          image: product.image,
          size: product.size,
          category: product.category,
          price: product.price,
          quantity,
        },
      ]
    })
  }

  function updateQuantity(productId, quantity) {
    setItems((current) => current
      .map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item)
    )
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = useMemo(() => ({
    items,
    subtotal,
    count,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }), [items, subtotal, count])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
