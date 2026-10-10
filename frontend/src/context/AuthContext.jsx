import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchCurrentUser, loginUser, registerUser, updateCurrentUser } from "../api/auth"
import { AuthContext } from "./auth"
const TOKEN_KEY = "scentora_token"

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    let active = true

    async function loadUser() {
      if (!token) {
        setLoading(false)
        setUser(null)
        return
      }

      try {
        setLoading(true)
        const data = await fetchCurrentUser(token)
        if (active) setUser(data.user)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadUser()

    return () => {
      active = false
    }
  }, [token])

  async function login(credentials) {
    const data = await loginUser(credentials)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const data = await registerUser(payload)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const updateProfile = useCallback(async (payload) => {
    const data = await updateCurrentUser(payload, token)
    setUser(data.user)
    return data.user
  }, [token])

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateProfile,
  }), [token, user, loading, updateProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
