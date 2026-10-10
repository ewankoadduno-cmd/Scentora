import { useMemo, useState } from "react"
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
  const [statusFilter, setStatusFilter] = useState("All")
  const [paymentFilter, setPaymentFilter] = useState("All")
  const [search, setSearch] = useState("")

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter
      const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter
      const haystack = `${order.orderNumber} ${order.customerName} ${order.customerEmail}`.toLowerCase()
      return matchesStatus && matchesPayment && haystack.includes(search.toLowerCase())
    })
  }, [orders, paymentFilter, search, statusFilter])

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
      <div className="mb-5 space-y-4 rounded-[5px] border border-border bg-cream p-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by order number, customer, or email..."
          className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze"
        />
        <FilterRow label="Order Status" items={["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]} value={statusFilter} setValue={setStatusFilter} />
        <FilterRow label="Payment Status" items={["All", "Pending", "Awaiting proof", "Paid", "Rejected"]} value={paymentFilter} setValue={setPaymentFilter} />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
        <p><span className="font-bold text-ink">{filteredOrders.length}</span> matching orders</p>
        {(search || statusFilter !== "All" || paymentFilter !== "All") && (
          <button onClick={() => { setSearch(""); setStatusFilter("All"); setPaymentFilter("All") }} className="font-bold text-bronze hover:text-ink">
            Clear filters
          </button>
        )}
      </div>

      {loading && <p className="text-[14px] font-semibold text-muted">Loading orders...</p>}
      {error && <p className="rounded-[4px] bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">{error}</p>}

      {!loading && !error && filteredOrders.length === 0 && (
        <section className="rounded-[6px] border border-border bg-cream p-8">
          <h2 className="font-display text-[32px]">No orders found.</h2>
          <p className="mt-2 text-[14px] text-muted">Try changing the search, order status, or payment status filter.</p>
        </section>
      )}

      {!loading && !error && filteredOrders.length > 0 && (
      <AdminTable columns={["Order", "Customer", "Total", "Payment", "Status", "Action"]}>
        {filteredOrders.map((order) => (
          <tr key={order.orderNumber} className="border-t border-border-faint">
            <td className="px-5 py-4 font-bold">{order.orderNumber}</td>
            <td className="px-5 py-4 text-muted">{order.customerName}</td>
            <td className="px-5 py-4 font-bold">{formatPeso(order.total)}</td>
            <td className="px-5 py-4"><StatusPill tone={order.paymentStatus === "Paid" ? "good" : order.paymentStatus === "Rejected" ? "bad" : "warn"}>{order.paymentStatus}</StatusPill></td>
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

function FilterRow({ label, items, value, setValue }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((filter) => (
          <button
            key={filter}
            onClick={() => setValue(filter)}
            className={`rounded-full border px-4 py-2 text-[12px] font-bold transition-colors ${
              value === filter
                ? "border-ink bg-ink text-cream"
                : "border-border bg-cream text-muted hover:border-bronze hover:text-ink"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}
