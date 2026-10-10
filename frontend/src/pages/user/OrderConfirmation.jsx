import { Link, useLocation } from "react-router-dom"
import { formatPeso } from "../../data/catalog"

export default function OrderConfirmation() {
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return (
      <main className="container-page py-16">
        <section className="mx-auto max-w-[760px] rounded-[6px] border border-border bg-parchment p-8 text-center">
          <p className="eyebrow mb-3">Orders</p>
          <h1 className="heading-display text-[48px]">No recent checkout found.</h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-7 text-muted">
            Open your orders page to review purchases already saved to your account.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/orders" className="rounded-[3px] bg-ink px-6 py-3 text-[13.5px] font-bold text-cream">View My Orders</Link>
            <Link to="/shop" className="rounded-[3px] border border-border px-6 py-3 text-[13.5px] font-bold text-ink">Continue Shopping</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="container-page py-16">
      <section className="mx-auto max-w-[760px] rounded-[6px] border border-border bg-parchment p-8 text-center">
        <p className="eyebrow mb-3">Order Placed</p>
        <h1 className="heading-display text-[52px]">Thank you for your order.</h1>
        <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-7 text-muted">
          Your order number is <span className="font-bold text-ink">{order.orderNumber}</span>. We have received your checkout details and your order is now pending confirmation.
        </p>
        <div className="mt-8 rounded-[5px] border border-border bg-cream p-5 text-left">
          <div className="grid gap-4 sm:grid-cols-3">
            <Info label="Order Total" value={formatPeso(order.total)} />
            <Info label="Payment" value={order.paymentMethod} />
            <Info label="Status" value={order.status} />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={`/orders/${order.orderNumber}`} className="rounded-[3px] bg-ink px-6 py-3 text-[13.5px] font-bold text-cream">View My Order</Link>
          <Link to="/shop" className="rounded-[3px] border border-border px-6 py-3 text-[13.5px] font-bold text-ink">Continue Shopping</Link>
        </div>
      </section>
    </main>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1 font-bold text-ink">{value}</p>
    </div>
  )
}
