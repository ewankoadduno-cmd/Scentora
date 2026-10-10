import { useState } from "react"
import { Link } from "react-router-dom"
import ConfirmDialog from "../../components/ConfirmDialog"
import { useAuth } from "../../hooks/useAuth"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"

export default function MyAccount() {
  const { user, updateProfile } = useAuth()
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()
  const [form, setForm] = useState(() => profileFromUser(user))
  const [editingAddress, setEditingAddress] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSave(event) {
    event.preventDefault()
    setError("")
    setSuccess("")

    const confirmed = await confirm({
      title: "Save account changes?",
      message: "Your profile and saved delivery address will be updated for future checkouts.",
      confirmLabel: "Save Changes",
    })

    if (!confirmed) return

    setSaving(true)

    try {
      await updateProfile(form)
      setEditingAddress(false)
      setSuccess("Account details updated.")
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancelAddressEdit() {
    setEditingAddress(false)
    setError("")
    setSuccess("")
    setForm(profileFromUser(user))
  }

  const addressText = [
    form.address.street,
    form.address.city,
    form.address.province,
  ].filter(Boolean).join(", ")

  return (
    <main className="container-page py-12">
      <p className="eyebrow mb-3">Customer Profile</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-display text-[52px]">My Account</h1>
          <p className="mt-3 max-w-[560px] text-[14px] leading-7 text-muted">
            Manage your saved delivery details and quickly review your purchases.
          </p>
        </div>
        <Link to="/orders" className="inline-flex rounded-[3px] bg-ink px-5 py-3 text-[13px] font-bold text-cream transition-colors hover:bg-ink-soft">
          View My Orders
        </Link>
      </div>

      <form onSubmit={handleSave} className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-[5px] border border-border bg-cream p-6">
          <h2 className="font-display text-[30px]">Profile Info</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(name) => setFormValue(setForm, "name", name)} required />
            <Field label="Email" value={user?.email || ""} disabled />
            <Field label="Contact Number" value={form.contactNumber} onChange={(contactNumber) => setFormValue(setForm, "contactNumber", contactNumber)} />
            <Field label="Password" value="Password changes are handled separately" disabled />
          </div>
          <button disabled={saving} className="mt-6 rounded-[3px] bg-ink px-5 py-3 text-[13px] font-bold text-cream transition-colors hover:bg-ink-soft disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {success && <p className="mt-4 rounded-[4px] bg-emerald-50 px-4 py-3 text-[12.5px] font-semibold text-emerald-700">{success}</p>}
          {error && <p className="mt-4 rounded-[4px] bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">{error}</p>}
        </section>

        <section className="rounded-[5px] border border-border bg-parchment p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-[30px]">Saved Delivery Address</h2>
            {!editingAddress && (
              <button
                type="button"
                onClick={() => setEditingAddress(true)}
                className="rounded-[3px] border border-border bg-cream px-4 py-2 text-[12.5px] font-bold text-ink transition-colors hover:border-bronze hover:text-bronze"
              >
                Edit Address
              </button>
            )}
          </div>

          {editingAddress ? (
            <div className="mt-5 grid gap-4">
              <Field label="Street Address" value={form.address.street} onChange={(street) => setAddressValue(setForm, "street", street)} placeholder="House no., street, barangay" />
              <Field label="City / Municipality" value={form.address.city} onChange={(city) => setAddressValue(setForm, "city", city)} placeholder="Baliuag" />
              <Field label="Province" value={form.address.province} onChange={(province) => setAddressValue(setForm, "province", province)} placeholder="Bulacan" />
              <div className="flex flex-wrap gap-3">
                <button disabled={saving} className="rounded-[3px] bg-bronze px-5 py-3 text-[13px] font-bold text-cream transition-colors hover:bg-bronze-light disabled:opacity-60">
                  {saving ? "Saving..." : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAddressEdit}
                  className="rounded-[3px] border border-border bg-cream px-5 py-3 text-[13px] font-bold text-ink transition-colors hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 max-w-[420px] text-[14px] leading-7 text-muted">
              {addressText || "No saved delivery address yet. Add one before your next checkout."}
            </p>
          )}
        </section>
      </form>

      {confirmRequest && (
        <ConfirmDialog
          {...confirmRequest}
          onCancel={() => closeConfirm(false)}
          onConfirm={() => closeConfirm(true)}
        />
      )}
    </main>
  )
}

function Field({ label, value, onChange, placeholder, disabled = false, required = false }) {
  return (
    <label>
      <span className="mb-2 block text-[12px] font-bold text-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze disabled:cursor-not-allowed disabled:bg-border-faint disabled:text-muted"
      />
    </label>
  )
}

function setFormValue(setForm, field, value) {
  setForm((previous) => ({ ...previous, [field]: value }))
}

function setAddressValue(setForm, field, value) {
  setForm((previous) => ({
    ...previous,
    address: {
      ...previous.address,
      [field]: value,
    },
  }))
}

function profileFromUser(user) {
  return {
    name: user?.name || "",
    contactNumber: user?.contactNumber || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      province: user?.address?.province || "",
    },
  }
}
