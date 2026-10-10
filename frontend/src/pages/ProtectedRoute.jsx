import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-parchment text-ink">
        <p className="font-display text-[28px]">Checking session...</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />
  }

  return children
}
