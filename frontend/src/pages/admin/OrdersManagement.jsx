import { Link } from "react-router-dom"
import { updateOrderStatus } from "../../api/orders"
import AdminLayout, { AdminTable, StatusPill } from "../../components/AdminLayout"
import ConfirmDialog from "../../components/ConfirmDialog"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"
import { useOrders } from "../../hooks/useOrders"

export default function OrdersManagement() {
  const { token } = useAuth()
  const { orders, loading, error, refetch } = useOrders(token, true)
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()

  async function handleStatusChange(order, status) {
    if (status === order.status) return

    const confirmed = await confirm({
      title: "Update order status?",
      message: `${order.orderNumber} will change from ${order.status} to ${status}.`,
      confirmLabel: "Update Status",
    })

    if (!confirmed) return

    try {
      await updateOrderStatus(order.orderNumber, { status }, token)
      refetch()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <AdminLayout eyebrow="Fulfillment" title="Orders Management">
      <div className="mb-5 flex flex-wrap gap-3">
        {["All", "Pending", "Paid", "Shipped", "Delivered"].map((filter) => (
          <button key={filter} className="rounded-full border border-border bg-cream px-4 py-2 text-[12px] font-bold text-muted hover:border-bronze hover:text-ink">
            {filter}
          </button>
        ))}
      </div>

      {loading && <p className="text-[14px] font-semibold text-muted">Loading orders...</p>}
      {error && <p className="rounded-[4px] bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <section className="rounded-[6px] border border-border bg-cream p-8">
          <h2 className="font-display text-[32px]">No orders yet.</h2>
          <p className="mt-2 text-[14px] text-muted">Placed customer orders will appear here.</p>
        </section>
      )}

      {!loading && !error && orders.length > 0 && (
      <AdminTable columns={["Order", "Customer", "Total", "Payment", "Status", "Action"]}>
        {orders.map((order) => (
          <tr key={order.orderNumber} className="border-t border-border-faint">
            <td className="px-5 py-4 font-bold">{order.orderNumber}</td>
            <td className="px-5 py-4 text-muted">{order.customerName}</td>
            <td className="px-5 py-4 font-bold">{formatPeso(order.total)}</td>
            <td className="px-5 py-4"><StatusPill tone={order.paymentStatus === "Paid" ? "good" : "warn"}>{order.paymentStatus}</StatusPill></td>
            <td className="px-5 py-4">
              <select value={order.status} onChange={(event) => handleStatusChange(order, event.target.value)} className="rounded-[3px] border border-border bg-cream px-3 py-2 text-[12px] font-bold">
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </td>
            <td className="px-5 py-4"><Link to={`/admin/orders/${order.orderNumber}`} className="font-bold text-bronze">View</Link></td>
          </tr>
        ))}
      </AdminTable>
      )}
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
