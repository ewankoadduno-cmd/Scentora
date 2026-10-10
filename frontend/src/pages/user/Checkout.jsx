import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createOrder } from "../../api/orders"
import ConfirmDialog from "../../components/ConfirmDialog"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useCart } from "../../hooks/useCart"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"

const shipping = 120

export default function Checkout() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const { clearCart, items, subtotal } = useCart()
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery")
  const [delivery, setDelivery] = useState({
    name: user?.name || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "Baliuag",
    province: user?.address?.province || "Bulacan",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    const confirmed = await confirm({
      title: "Place this order?",
      message: `Your order total is ${formatPeso(subtotal + shipping)}. Please confirm that your delivery details and payment method are correct.`,
      confirmLabel: "Place Order",
    })

    if (!confirmed) return

    setSubmitting(true)

    try {
      const order = await createOrder({
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        delivery,
        paymentMethod,
      }, token)

      clearCart()
      navigate("/order-confirmation", { state: { order } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="container-page py-16">
        <section className="rounded-[6px] border border-border bg-parchment p-8 text-center">
          <h1 className="heading-display text-[46px]">Your cart is empty.</h1>
          <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-7 text-muted">Add an item before checking out.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-[3px] bg-ink px-6 py-3 text-[13px] font-bold text-cream">Shop Fragrances</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="container-page py-12">
      <p className="eyebrow mb-3">Secure Checkout</p>
      <h1 className="heading-display text-[52px]">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <Panel title="Delivery Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" name="name" autoComplete="name" value={delivery.name} onChange={(name) => setDeliveryValue(setDelivery, "name", name)} placeholder="Juan Dela Cruz" />
              <Field label="Contact Number" name="tel" autoComplete="tel" value={delivery.contactNumber} onChange={(contactNumber) => setDeliveryValue(setDelivery, "contactNumber", contactNumber)} placeholder="09XX XXX XXXX" />
              <Field label="Street Address" name="street-address" autoComplete="street-address" value={delivery.address} onChange={(address) => setDeliveryValue(setDelivery, "address", address)} placeholder="House no., street, barangay" wide />
              <Field label="City / Municipality" name="address-level2" autoComplete="address-level2" value={delivery.city} onChange={(city) => setDeliveryValue(setDelivery, "city", city)} placeholder="Baliuag" />
              <Field label="Province" name="address-level1" autoComplete="address-level1" value={delivery.province} onChange={(province) => setDeliveryValue(setDelivery, "province", province)} placeholder="Bulacan" />
            </div>
          </Panel>

          <Panel title="Payment Method">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Cash on Delivery", "GCash / Bank Transfer"].map((method) => (
                <label key={method} className="flex items-center gap-3 rounded-[5px] border border-border bg-cream p-4 text-[13px] font-semibold">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-ink"
                  />
                  {method}
                </label>
              ))}
            </div>
          </Panel>
        </section>

        <aside className="h-fit rounded-[5px] border border-border bg-parchment p-6">
          <h2 className="font-display text-[28px]">Review Order</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-[4px] object-cover" />
                <div className="flex-1">
                  <p className="text-[13px] font-bold">{item.name}</p>
                  <p className="text-[12px] text-muted">Qty {item.quantity}</p>
                </div>
                <p className="text-[13px] font-bold">{formatPeso(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-border pt-5 text-[13px]">
            <Summary label="Subtotal" value={formatPeso(subtotal)} />
            <Summary label="Shipping fee" value={formatPeso(shipping)} />
            <Summary label="Total" value={formatPeso(subtotal + shipping)} strong />
          </div>
          {error && <p className="mt-4 rounded-[4px] bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">{error}</p>}
          <button disabled={submitting} className="mt-6 flex w-full justify-center rounded-[3px] bg-bronze px-5 py-3 text-[13.5px] font-bold text-cream transition-colors hover:bg-bronze-light disabled:opacity-60">
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </aside>
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

function Panel({ title, children }) {
  return (
    <div className="rounded-[5px] border border-border bg-cream p-6">
      <h2 className="font-display text-[28px]">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function Field({ label, name, placeholder, value, onChange, wide = false, autoComplete }) {
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-2 block text-[12px] font-bold text-muted">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze"
        placeholder={placeholder}
      />
    </label>
  )
}

function Summary({ label, value, strong = false }) {
  return (
    <div className={`flex justify-between ${strong ? "text-[17px] font-bold" : "text-muted"}`}>
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

function setDeliveryValue(setDelivery, field, value) {
  setDelivery((previous) => ({ ...previous, [field]: value }))
}
