import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: "", contactNumber: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await register(form)
      navigate("/account", { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-parchment px-6 py-12">
      <section className="w-full max-w-[500px] rounded-[6px] border border-border bg-cream p-7">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-[21px]">Scentora</Link>
          <Link to="/" className="text-[12.5px] font-bold text-muted hover:text-ink">Back to store</Link>
        </div>
        <h1 className="heading-display mt-9 text-[42px]">Create account</h1>
        <p className="mt-3 text-[14px] leading-7 text-muted">Register to checkout faster and view order history.</p>
        <form onSubmit={handleSubmit} className="mt-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={(name) => setForm((prev) => ({ ...prev, name }))} />
            <Field label="Contact Number" name="tel" autoComplete="tel" placeholder="09XX XXX XXXX" value={form.contactNumber} onChange={(contactNumber) => setForm((prev) => ({ ...prev, contactNumber }))} />
            <Field label="Email" name="email" autoComplete="email" placeholder="you@example.com" wide value={form.email} onChange={(email) => setForm((prev) => ({ ...prev, email }))} />
            <Field label="Password" name="password" autoComplete="new-password" placeholder="Create a password" wide type="password" value={form.password} onChange={(password) => setForm((prev) => ({ ...prev, password }))} />
          </div>
          {error && <p className="mt-4 rounded-[4px] bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">{error}</p>}
          <button disabled={submitting} className="mt-6 flex w-full justify-center rounded-[3px] bg-ink px-5 py-3 text-[13.5px] font-bold text-cream disabled:opacity-60">
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-5 text-center text-[13px] text-muted">
          Already registered? <Link to="/login" className="font-bold text-bronze">Login</Link>
        </p>
      </section>
    </main>
  )
}

function Field({ label, name, placeholder, type = "text", wide = false, value, onChange, autoComplete }) {
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
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
