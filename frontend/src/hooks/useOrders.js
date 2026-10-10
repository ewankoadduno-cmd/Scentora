import { useCallback, useEffect, useState } from "react"
import { fetchAllOrders, fetchMyOrders, fetchOrder } from "../api/orders"

export function useOrders(token, admin = false) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const refetch = useCallback(async () => {
    if (!token) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")
      const data = admin ? await fetchAllOrders(token) : await fetchMyOrders(token)
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [admin, token])

  useEffect(() => {
    let active = true

    async function load() {
      if (!token) {
        setOrders([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")
        const data = admin ? await fetchAllOrders(token) : await fetchMyOrders(token)
        if (active) setOrders(data)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [admin, token])

  return { orders, loading, error, refetch }
}

export function useOrder(orderNumber, token) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const refetch = useCallback(async () => {
    if (!token || !orderNumber) {
      setOrder(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")
      const data = await fetchOrder(orderNumber, token)
      setOrder(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [orderNumber, token])

  useEffect(() => {
    let active = true

    async function load() {
      if (!token || !orderNumber) {
        setOrder(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")
        const data = await fetchOrder(orderNumber, token)
        if (active) setOrder(data)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [orderNumber, token])

  return { order, loading, error, refetch, setOrder }
}
