import AdminLayout, { AdminTable, StatusPill } from "../../components/AdminLayout"
import ConfirmDialog from "../../components/ConfirmDialog"
import { updateProductStock } from "../../api/products"
import { useAuth } from "../../hooks/useAuth"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"
import { useProducts } from "../../hooks/useProducts"

export default function Inventory() {
  const { token } = useAuth()
  const { products, refetch } = useProducts()
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()

  async function handleStockUpdate(product) {
    const nextStock = window.prompt(`Set new stock for ${product.brand} ${product.name}:`, String(product.stock))
    if (nextStock === null) return
    const numericStock = Number(nextStock)

    if (Number.isNaN(numericStock) || numericStock < 0) {
      window.alert("Stock must be a valid number.")
      return
    }

    const confirmed = await confirm({
      title: "Update product stock?",
      message: `${product.brand} ${product.name} stock will change from ${product.stock} to ${numericStock}.`,
      confirmLabel: "Update Stock",
    })

    if (!confirmed) return

    try {
      await updateProductStock(product.slug, numericStock, token)
      await refetch()
    } catch (error) {
      window.alert(error.message)
    }
  }

  return (
    <AdminLayout eyebrow="Stock Control" title="Inventory">
      <div className="mb-5 rounded-[5px] border border-border bg-cream p-5 text-[13px] text-muted">
        Stock will automatically deduct when an order is placed. This MVP screen shows current stock and out-of-stock indicators.
      </div>
      <AdminTable columns={["Product", "SKU", "Current Stock", "Indicator", "Actions"]}>
        {products.map((product) => (
          <tr key={product.id} className="border-t border-border-faint">
            <td className="px-5 py-4 font-bold">{product.brand} {product.name}</td>
            <td className="px-5 py-4 text-muted">{product.id.toUpperCase()}</td>
            <td className="px-5 py-4 font-bold">{product.stock}</td>
            <td className="px-5 py-4">
              <StatusPill tone={product.stock === 0 ? "bad" : product.stock < 10 ? "warn" : "good"}>
                {product.stock === 0 ? "Out of stock" : product.stock < 10 ? "Low stock" : "Available"}
              </StatusPill>
            </td>
            <td className="px-5 py-4"><button onClick={() => handleStockUpdate(product)} className="rounded-[3px] border border-border px-3 py-2 text-[12px] font-bold">Update Stock</button></td>
          </tr>
        ))}
      </AdminTable>
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
