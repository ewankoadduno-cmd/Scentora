import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useOrders } from "../../hooks/useOrders"

export default function MyOrders() {
  const { token } = useAuth()
  const { orders, loading, error } = useOrders(token)
  const [filter, setFilter] = useState("All")

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filter === "All") return true
      if (filter === "Completed") return order.status === "Delivered" || order.paymentStatus === "Paid"
      if (filter === "Active") return !["Delivered", "Cancelled"].includes(order.status)
      return order.status === filter
    })
  }, [filter, orders])

  return (
    <main className="container-page py-12">
      <p className="eyebrow mb-3">Purchases</p>
      <h1 className="heading-display text-[52px]">My Orders</h1>
      <p className="mt-3 max-w-[560px] text-[14px] leading-7 text-muted">
        Paid and delivered orders stay here for your records.
      </p>

      {loading && <p className="mt-8 text-[14px] font-semibold text-muted">Loading your orders...</p>}
      {error && <p className="mt-8 rounded-[4px] bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <section className="mt-10 rounded-[6px] border border-border bg-parchment p-8 text-center">
          <h2 className="font-display text-[34px]">No orders yet.</h2>
          <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-7 text-muted">When you checkout, your saved orders will appear here.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-[3px] bg-ink px-6 py-3 text-[13px] font-bold text-cream">Shop Fragrances</Link>
        </section>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {["All", "Active", "Completed", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
                  filter === item
                    ? "border-ink bg-ink text-cream"
                    : "border-border bg-cream text-muted hover:border-bronze hover:text-ink"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-[5px] border border-border bg-cream">
            <table className="w-full min-w-[860px] text-left text-[13px]">
              <thead className="bg-parchment text-[10px] uppercase tracking-[0.16em] text-faint">
                <tr>
                  <th className="px-5 py-4">Order No.</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Order Status</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderNumber} className="border-t border-border-faint">
                    <td className="px-5 py-4 font-bold">{order.orderNumber}</td>
                    <td className="px-5 py-4 text-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 text-muted">{order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}</td>
                    <td className="px-5 py-4 font-bold">{formatPeso(order.total)}</td>
                    <td className="px-5 py-4"><StatusPill status={order.paymentStatus} type="payment" /></td>
                    <td className="px-5 py-4"><StatusPill status={order.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/orders/${order.orderNumber}`} className="font-bold text-ink hover:text-bronze">View details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="border-t border-border-faint p-8 text-center">
                <h2 className="font-display text-[30px]">No matching orders.</h2>
                <p className="mt-2 text-[14px] text-muted">Try another order status filter.</p>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}

function StatusPill({ status, type = "order" }) {
  const tone = type === "payment"
    ? status === "Paid" ? "good" : status === "Rejected" ? "bad" : "warn"
    : status === "Delivered" ? "good" : status === "Cancelled" ? "bad" : "warn"

  const classes = {
    good: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    bad: "bg-rose-50 text-rose-700",
  }

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${classes[tone]}`}>
      {status}
    </span>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
