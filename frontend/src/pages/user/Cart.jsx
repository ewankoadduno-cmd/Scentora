import { Link } from "react-router-dom"
import ConfirmDialog from "../../components/ConfirmDialog"
import { formatPeso } from "../../data/catalog"
import { useCart } from "../../hooks/useCart"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"

export default function Cart() {
  const { items, removeItem, subtotal, updateQuantity } = useCart()
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()
  const shipping = items.length ? 120 : 0

  async function handleRemove(item) {
    const confirmed = await confirm({
      title: "Remove this item?",
      message: `${item.brand} ${item.name} will be removed from your cart.`,
      confirmLabel: "Remove Item",
      tone: "danger",
    })

    if (confirmed) removeItem(item.productId)
  }

  return (
    <main className="container-page py-12">
      <p className="eyebrow mb-3">Shopping Bag</p>
      <h1 className="heading-display text-[52px]">Your Cart</h1>

      {items.length === 0 ? (
        <section className="mt-10 rounded-[6px] border border-border bg-parchment p-8 text-center">
          <h2 className="font-display text-[34px]">Your cart is empty.</h2>
          <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-7 text-muted">Add a fragrance first, then return here to checkout.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-[3px] bg-ink px-6 py-3 text-[13px] font-bold text-cream">Shop Fragrances</Link>
        </section>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            {items.map((item) => (
              <article key={item.productId} className="grid gap-4 rounded-[5px] border border-border bg-cream p-4 sm:grid-cols-[120px_1fr_auto]">
                <img src={item.image} alt={item.name} className="aspect-square w-full rounded-[4px] object-cover sm:w-[120px]" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-bronze">{item.brand}</p>
                  <h2 className="font-display text-[24px]">{item.name}</h2>
                  <p className="mt-1 text-[12px] text-muted">{item.size} · {item.category}</p>
                  <button onClick={() => handleRemove(item)} className="mt-4 text-[12px] font-bold text-muted hover:text-ink">Remove</button>
                </div>
                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                  <div className="flex h-10 overflow-hidden rounded-[4px] border border-border">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-10 bg-parchment">-</button>
                    <span className="flex w-11 items-center justify-center text-[13px] font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-10 bg-parchment">+</button>
                  </div>
                  <p className="font-bold text-ink">{formatPeso(item.price * item.quantity)}</p>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-[5px] border border-border bg-parchment p-6">
            <h2 className="font-display text-[28px]">Order Summary</h2>
            <div className="mt-6 space-y-3 border-b border-border pb-5 text-[13px]">
              <Row label="Subtotal" value={formatPeso(subtotal)} />
              <Row label="Shipping" value={formatPeso(shipping)} />
              <Row label="Estimated Total" value={formatPeso(subtotal + shipping)} strong />
            </div>
            <Link to="/checkout" className="mt-6 flex w-full justify-center rounded-[3px] bg-ink px-5 py-3 text-[13.5px] font-bold text-cream transition-colors hover:bg-ink-soft">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="mt-3 flex w-full justify-center rounded-[3px] border border-border px-5 py-3 text-[13px] font-bold text-ink transition-colors hover:bg-cream">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
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

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex justify-between ${strong ? "pt-2 text-[16px] font-bold" : "text-muted"}`}>
      <span>{label}</span>
      <span className={strong ? "text-ink" : "font-semibold text-ink"}>{value}</span>
    </div>
  )
}
