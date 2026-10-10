import { useCallback, useEffect, useState } from "react"
import { fetchProduct, fetchProducts, getFallbackProductById, getFallbackProducts } from "../api/products"

export function useProducts(params = {}) {
  const { category, family, maxPrice, minPrice, search, size, sort } = params
  const [items, setItems] = useState(getFallbackProducts())
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState("fallback")

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchProducts({ category, family, maxPrice, minPrice, search, size, sort })
      setItems(data)
      setSource("database")
    } catch {
      setItems(getFallbackProducts())
      setSource("fallback")
    } finally {
      setLoading(false)
    }
  }, [category, family, maxPrice, minPrice, search, size, sort])

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setLoading(true)
        const data = await fetchProducts({ category, family, maxPrice, minPrice, search, size, sort })
        if (!active) return
        setItems(data)
        setSource("database")
      } catch {
        if (!active) return
        setItems(getFallbackProducts())
        setSource("fallback")
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [category, family, maxPrice, minPrice, refetch, search, size, sort])

  return { products: items, loading, source, refetch }
}

export function useProduct(productId) {
  const [item, setItem] = useState(getFallbackProductById(productId))
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState("fallback")

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setLoading(true)
        const data = await fetchProduct(productId)
        if (!active) return
        setItem(data)
        setSource("database")
      } catch {
        if (!active) return
        setItem(getFallbackProductById(productId))
        setSource("fallback")
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [productId])

  return { product: item, loading, source }
}
