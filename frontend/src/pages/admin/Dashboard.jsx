import { Link } from "react-router-dom"
import AdminLayout, { AdminTable, StatusPill } from "../../components/AdminLayout"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useOrders } from "../../hooks/useOrders"
import { useProducts } from "../../hooks/useProducts"

export default function Dashboard() {
  const { token } = useAuth()
  const { orders, loading: ordersLoading } = useOrders(token, true)
  const { products } = useProducts()
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
  const totalCustomers = new Set(orders.map((order) => order.customerEmail)).size

  return (
    <AdminLayout eyebrow="Overview" title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Total Sales" value={formatPeso(totalSales)} />
        <Metric label="Total Orders" value={orders.length} />
        <Metric label="Total Customers" value={totalCustomers} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[30px]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[12.5px] font-bold text-bronze">Manage orders</Link>
          </div>
          <AdminTable columns={["Order", "Date", "Total", "Status"]}>
            {ordersLoading && (
              <tr className="border-t border-border-faint">
                <td colSpan="4" className="px-5 py-6 text-muted">Loading orders...</td>
              </tr>
            )}
            {!ordersLoading && orders.slice(0, 5).map((order) => (
              <tr key={order.orderNumber} className="border-t border-border-faint">
                <td className="px-5 py-4 font-bold">{order.orderNumber}</td>
                <td className="px-5 py-4 text-muted">{formatDate(order.createdAt)}</td>
                <td className="px-5 py-4 font-bold">{formatPeso(order.total)}</td>
                <td className="px-5 py-4"><StatusPill tone={order.status === "Delivered" ? "good" : "warn"}>{order.status}</StatusPill></td>
              </tr>
            ))}
            {!ordersLoading && orders.length === 0 && (
              <tr className="border-t border-border-faint">
                <td colSpan="4" className="px-5 py-6 text-muted">No orders yet.</td>
              </tr>
            )}
          </AdminTable>
        </section>

        <section className="rounded-[5px] border border-border bg-cream p-6">
          <h2 className="font-display text-[30px]">Best-Selling Products</h2>
          <div className="mt-5 space-y-4">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 border-b border-border-faint pb-4 last:border-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-parchment text-[12px] font-bold text-bronze">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-bold">{product.name}</p>
                  <p className="text-[12px] text-muted">{product.brand}</p>
                </div>
                <p className="text-[12px] font-bold text-muted">{product.stock} left</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-[5px] border border-border bg-cream p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-3 font-display text-[34px]">{value}</p>
    </div>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
