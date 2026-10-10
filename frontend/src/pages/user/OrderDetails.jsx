import { Link, useParams } from "react-router-dom"
import { cancelOrder } from "../../api/orders"
import ConfirmDialog from "../../components/ConfirmDialog"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"
import { useOrder } from "../../hooks/useOrders"

export default function OrderDetails() {
  const { orderId } = useParams()
  const { token } = useAuth()
  const { order, loading, error, setOrder } = useOrder(orderId, token)
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()

  async function handleCancel() {
    const confirmed = await confirm({
      title: "Cancel this order?",
      message: "This will mark the order as cancelled and return the items to stock.",
      confirmLabel: "Cancel Order",
      tone: "danger",
    })

    if (!confirmed) return

    try {
      const updated = await cancelOrder(order.orderNumber, token)
      setOrder(updated)
    } catch (err) {
      window.alert(err.message)
    }
  }

  if (loading) {
    return (
      <main className="container-page py-12">
        <Link to="/orders" className="text-[13px] font-bold text-muted hover:text-ink">Back to orders</Link>
        <p className="mt-8 text-[14px] font-semibold text-muted">Loading order details...</p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="container-page py-12">
        <Link to="/orders" className="text-[13px] font-bold text-muted hover:text-ink">Back to orders</Link>
        <section className="mt-8 rounded-[6px] border border-border bg-parchment p-8">
          <h1 className="heading-display text-[44px]">Order not found.</h1>
          <p className="mt-3 text-[14px] text-muted">{error || "This order could not be loaded."}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="container-page py-12">
      <Link to="/orders" className="text-[13px] font-bold text-muted hover:text-ink">Back to orders</Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow mb-3">Order Details</p>
          <h1 className="heading-display text-[52px]">{order.orderNumber}</h1>
        </div>
        {order.status === "Pending" && (
          <button onClick={handleCancel} className="rounded-[3px] border border-border bg-cream px-5 py-3 text-[13px] font-bold text-ink">Cancel Order</button>
        )}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[5px] border border-border bg-cream p-6">
          <h2 className="font-display text-[30px]">Items Ordered</h2>
          <div className="mt-5 space-y-3">
            {order.items.map((item) => (
              <div key={item.slug} className="flex items-center gap-4 border-b border-border-faint pb-3 last:border-0">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-[4px] object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-ink">{item.name}</p>
                  <p className="text-[12px] text-muted">{item.brand} / {item.size}</p>
                </div>
                <span className="font-bold">Qty {item.quantity}</span>
                <span className="font-bold">{formatPeso(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-[5px] border border-border bg-parchment p-6">
          <h2 className="font-display text-[30px]">Summary</h2>
          <Info label="Delivery" value={`${order.delivery.address}, ${order.delivery.city}, ${order.delivery.province}`} />
          <Info label="Contact" value={order.delivery.contactNumber} />
          <Info label="Payment Method" value={order.paymentMethod} />
          <Info label="Order Status" value={order.status} />
          <Info label="Payment Status" value={order.paymentStatus} />
          <Info label="Subtotal" value={formatPeso(order.subtotal)} />
          <Info label="Shipping" value={formatPeso(order.shippingFee)} />
          <Info label="Total" value={formatPeso(order.total)} />
          {order.paymentMethod !== "Cash on Delivery" && (
            <button className="mt-6 w-full rounded-[3px] bg-ink px-5 py-3 text-[13px] font-bold text-cream">Upload Payment Proof</button>
          )}
        </aside>
      </div>
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

function Info({ label, value }) {
  return (
    <div className="mt-5 border-b border-border pb-4 last:border-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1 text-[13.5px] font-bold text-ink">{value}</p>
    </div>
  )
}
