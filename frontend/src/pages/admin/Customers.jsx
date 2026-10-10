import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import AdminLayout, { AdminTable, StatusPill } from "../../components/AdminLayout"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useOrders } from "../../hooks/useOrders"

export default function Customers() {
  const { token } = useAuth()
  const { orders, loading, error } = useOrders(token, true)
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const customers = useMemo(() => {
    const customerMap = new Map()

    orders.forEach((order) => {
      const key = order.customerEmail
      const current = customerMap.get(key) ?? {
        name: order.customerName,
        email: order.customerEmail,
        contact: order.delivery?.contactNumber || "Not provided",
        totalSpent: 0,
        latestOrderDate: order.createdAt,
        orders: [],
      }

      current.orders.push(order)
      current.totalSpent += order.total
      current.contact = order.delivery?.contactNumber || current.contact
      if (new Date(order.createdAt) > new Date(current.latestOrderDate)) {
        current.latestOrderDate = order.createdAt
        current.name = order.customerName
      }
      customerMap.set(key, current)
    })

    return Array.from(customerMap.values()).sort((a, b) => new Date(b.latestOrderDate) - new Date(a.latestOrderDate))
  }, [orders])

  const filteredCustomers = customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.email} ${customer.contact}`.toLowerCase()
    return haystack.includes(search.toLowerCase())
  })

  return (
    <AdminLayout eyebrow="Customer Records" title="Customers">
      <div className="mb-5 rounded-[5px] border border-border bg-cream p-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customers by name, email, or contact number..."
          className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze"
        />
      </div>

      {loading && <p className="text-[14px] font-semibold text-muted">Loading customers...</p>}
      {error && <p className="rounded-[4px] bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">{error}</p>}

      {!loading && !error && filteredCustomers.length === 0 && (
        <section className="rounded-[6px] border border-border bg-cream p-8">
          <h2 className="font-display text-[32px]">No customers found.</h2>
          <p className="mt-2 text-[14px] text-muted">Customer records will appear after orders are placed.</p>
        </section>
      )}

      {!loading && !error && filteredCustomers.length > 0 && (
        <AdminTable columns={["Name", "Email", "Contact", "Orders", "Total Spent", "Latest Order", "Action"]}>
          {filteredCustomers.map((customer) => (
            <tr key={customer.email} className="border-t border-border-faint">
              <td className="px-5 py-4 font-bold">{customer.name}</td>
              <td className="px-5 py-4 text-muted">{customer.email}</td>
              <td className="px-5 py-4 text-muted">{customer.contact}</td>
              <td className="px-5 py-4 font-bold">{customer.orders.length}</td>
              <td className="px-5 py-4 font-bold">{formatPeso(customer.totalSpent)}</td>
              <td className="px-5 py-4 text-muted">{formatDate(customer.latestOrderDate)}</td>
              <td className="px-5 py-4">
                <button onClick={() => setSelectedCustomer(customer)} className="font-bold text-bronze hover:text-ink">
                  View order history
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {selectedCustomer && (
        <OrderHistoryModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </AdminLayout>
  )
}

function OrderHistoryModal({ customer, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8 backdrop-blur-sm">
      <section className="max-h-[88vh] w-full max-w-[860px] overflow-y-auto rounded-[6px] border border-border bg-cream p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-5">
          <div>
            <p className="eyebrow mb-2">Order History</p>
            <h2 className="font-display text-[34px]">{customer.name}</h2>
            <p className="mt-2 text-[13px] text-muted">{customer.email}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-[3px] border border-border px-3 py-2 text-[12px] font-bold">
            Close
          </button>
        </div>

        <div className="overflow-x-auto rounded-[5px] border border-border">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead className="bg-parchment text-[10px] uppercase tracking-[0.16em] text-faint">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr key={order.orderNumber} className="border-t border-border-faint">
                  <td className="px-5 py-4 font-bold">{order.orderNumber}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 text-muted">{order.items.length}</td>
                  <td className="px-5 py-4 font-bold">{formatPeso(order.total)}</td>
                  <td className="px-5 py-4"><StatusPill tone={order.paymentStatus === "Paid" ? "good" : order.paymentStatus === "Rejected" ? "bad" : "warn"}>{order.paymentStatus}</StatusPill></td>
                  <td className="px-5 py-4"><StatusPill tone={order.status === "Delivered" ? "good" : order.status === "Cancelled" ? "bad" : "warn"}>{order.status}</StatusPill></td>
                  <td className="px-5 py-4"><Link to={`/admin/orders/${order.orderNumber}`} className="font-bold text-bronze hover:text-ink">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
