import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: "", contactNumber: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const passwordRules = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "One number", valid: /\d/.test(form.password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(form.password) },
  ]
  const passwordIsValid = passwordRules.every((rule) => rule.valid)
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!passwordIsValid) {
      setError("Please complete all password requirements.")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)

    try {
      await register({
        name: form.name,
        contactNumber: form.contactNumber,
        email: form.email,
        password: form.password,
      })
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
            <PasswordRequirements rules={passwordRules} />
            <Field label="Re-enter Password" name="confirmPassword" autoComplete="new-password" placeholder="Confirm your password" wide type="password" value={form.confirmPassword} onChange={(confirmPassword) => setForm((prev) => ({ ...prev, confirmPassword }))} />
          </div>
          {form.confirmPassword && (
            <p className={`mt-3 text-[12px] font-bold ${passwordsMatch ? "text-emerald-700" : "text-rose-700"}`}>
              {passwordsMatch ? "Passwords match." : "Passwords do not match."}
            </p>
          )}
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

function PasswordRequirements({ rules }) {
  return (
    <div className="sm:col-span-2 rounded-[4px] border border-border bg-parchment px-4 py-3">
      <p className="mb-2 text-[12px] font-bold text-muted">Password requirements</p>
      <ul className="grid gap-2 text-[12px] sm:grid-cols-2">
        {rules.map((rule) => (
          <li key={rule.label} className={`flex items-center gap-2 font-semibold ${rule.valid ? "text-emerald-700" : "text-muted"}`}>
            <span className={`grid size-4 place-items-center rounded-full border text-[10px] ${rule.valid ? "border-emerald-700 bg-emerald-700 text-cream" : "border-border text-faint"}`}>
              {rule.valid ? "OK" : ""}
            </span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
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
