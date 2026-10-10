import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useCart } from "../hooks/useCart"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { clearCart } = useCart()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const user = await login(form)
      if (user.role === "admin") clearCart()
      const fallback = user.role === "admin" ? "/admin" : "/account"
      navigate(location.state?.from?.pathname || fallback, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Login to continue shopping and tracking your orders.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(email) => setForm((prev) => ({ ...prev, email }))} />
        <Field label="Password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(password) => setForm((prev) => ({ ...prev, password }))} />
        {error && <p className="rounded-[4px] bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">{error}</p>}
        <button disabled={submitting} className="mt-2 flex w-full justify-center rounded-[3px] bg-ink px-5 py-3 text-[13.5px] font-bold text-cream disabled:opacity-60">
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="rounded-[4px] border border-border bg-parchment p-4 text-[12px] leading-6 text-muted">
        <p><span className="font-bold text-ink">Admin:</span> admin@scentora.test / Admin123!</p>
        <p><span className="font-bold text-ink">Customer:</span> customer@scentora.test / Customer123!</p>
      </div>
      <p className="mt-5 text-center text-[13px] text-muted">
        No account yet? <Link to="/register" className="font-bold text-bronze">Create one</Link>
      </p>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-parchment px-6 py-12">
      <section className="w-full max-w-[430px] rounded-[6px] border border-border bg-cream p-7">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-[21px]">Scentora</Link>
          <Link to="/" className="text-[12.5px] font-bold text-muted hover:text-ink">Back to store</Link>
        </div>
        <h1 className="heading-display mt-9 text-[42px]">{title}</h1>
        <p className="mt-3 text-[14px] leading-7 text-muted">{subtitle}</p>
        <div className="mt-7 space-y-4">{children}</div>
      </section>
    </main>
  )
}

function Field({ label, name, type, placeholder, value, onChange, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-bold text-muted">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze"
      />
    </label>
  )
}
