import { useParams } from "react-router-dom"
import { updateOrderStatus } from "../../api/orders"
import AdminLayout, { StatusPill } from "../../components/AdminLayout"
import ConfirmDialog from "../../components/ConfirmDialog"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"
import { useOrder } from "../../hooks/useOrders"

export default function OrderDetail() {
  const { orderId } = useParams()
  const { token } = useAuth()
  const { order, loading, error, setOrder } = useOrder(orderId, token)
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()

  async function handleUpdate(payload) {
    const field = payload.status ? "order status" : "payment status"
    const nextValue = payload.status || payload.paymentStatus
    const currentValue = payload.status ? order.status : order.paymentStatus

    if (nextValue === currentValue) return

    const confirmed = await confirm({
      title: `Update ${field}?`,
      message: `${order.orderNumber} will change from ${currentValue} to ${nextValue}.`,
      confirmLabel: "Update",
    })

    if (!confirmed) return

    try {
      const updated = await updateOrderStatus(order.orderNumber, payload, token)
      setOrder(updated)
    } catch (err) {
      window.alert(err.message)
    }
  }

  if (loading) {
    return (
      <AdminLayout eyebrow="Order Review" title="Loading...">
        <p className="text-[14px] font-semibold text-muted">Loading order details...</p>
      </AdminLayout>
    )
  }

  if (error || !order) {
    return (
      <AdminLayout eyebrow="Order Review" title="Order Not Found">
        <p className="rounded-[4px] bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">{error || "This order could not be loaded."}</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout eyebrow="Order Review" title={order.orderNumber}>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-[5px] border border-border bg-cream p-6">
          <h2 className="font-display text-[30px]">Customer and Delivery</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Info label="Customer" value={order.customerName} />
            <Info label="Email" value={order.customerEmail} />
            <Info label="Contact" value={order.delivery.contactNumber} />
            <Info label="Address" value={`${order.delivery.address}, ${order.delivery.city}, ${order.delivery.province}`} />
            <Info label="Payment Method" value={order.paymentMethod} />
            <Info label="Payment Status" value={order.paymentStatus} />
          </div>
          <h2 className="mt-8 font-display text-[30px]">Items Ordered</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.slug} className="flex items-center gap-4 border-b border-border-faint pb-3">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-[4px] object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-[12px] text-muted">{item.brand} / {item.size}</p>
                </div>
                <span className="text-muted">Qty {item.quantity}</span>
                <span className="font-bold">{formatPeso(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-[5px] border border-border bg-cream p-6">
          <h2 className="font-display text-[30px]">Controls</h2>
          <div className="mt-5 space-y-5">
            <Info label="Subtotal" value={formatPeso(order.subtotal)} />
            <Info label="Shipping" value={formatPeso(order.shippingFee)} />
            <Info label="Total" value={formatPeso(order.total)} />
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">Order Status</p>
              <StatusPill tone={order.status === "Delivered" ? "good" : "warn"}>{order.status}</StatusPill>
            </div>
            <select value={order.status} onChange={(event) => handleUpdate({ status: event.target.value })} className="w-full rounded-[3px] border border-border bg-parchment px-4 py-3 text-[13px] font-bold text-ink">
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <select value={order.paymentStatus} onChange={(event) => handleUpdate({ paymentStatus: event.target.value })} className="w-full rounded-[3px] border border-border bg-parchment px-4 py-3 text-[13px] font-bold text-ink">
              <option>Pending</option>
              <option>Awaiting proof</option>
              <option>Paid</option>
              <option>Rejected</option>
            </select>
            <button onClick={() => handleUpdate({ paymentStatus: "Paid" })} className="w-full rounded-[3px] border border-border px-5 py-3 text-[13px] font-bold text-ink">Mark Payment Received</button>
          </div>
        </aside>
      </div>
      {confirmRequest && (
        <ConfirmDialog
          {...confirmRequest}
          onCancel={() => closeConfirm(false)}
          onConfirm={() => closeConfirm(true)}
        />
      )}
    </AdminLayout>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1 text-[13.5px] font-bold text-ink">{value}</p>
    </div>
  )
}
