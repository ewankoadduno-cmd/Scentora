import { useState } from "react"
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
  const [stockModalProduct, setStockModalProduct] = useState(null)
  const [stockValue, setStockValue] = useState("")
  const [stockError, setStockError] = useState("")
  const [savingStock, setSavingStock] = useState(false)

  function openStockModal(product) {
    setStockModalProduct(product)
    setStockValue(String(product.stock))
    setStockError("")
  }

  function closeStockModal() {
    if (savingStock) return
    setStockModalProduct(null)
    setStockValue("")
    setStockError("")
  }

  async function handleStockUpdate(event) {
    event.preventDefault()
    if (!stockModalProduct) return

    const numericStock = Number(stockValue)

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      setStockError("Stock must be a whole number of zero or higher.")
      return
    }

    const confirmed = await confirm({
      title: "Update product stock?",
      message: `${stockModalProduct.brand} ${stockModalProduct.name} stock will change from ${stockModalProduct.stock} to ${numericStock}.`,
      confirmLabel: "Update Stock",
    })

    if (!confirmed) return

    setSavingStock(true)
    setStockError("")

    try {
      await updateProductStock(stockModalProduct.slug, numericStock, token)
      await refetch()
      setStockModalProduct(null)
      setStockValue("")
      setStockError("")
    } catch (error) {
      setStockError(error.message)
    } finally {
      setSavingStock(false)
    }
  }

  return (
    <AdminLayout eyebrow="Stock Control" title="Inventory">
      <div className="mb-5 rounded-[5px] border border-border bg-cream p-5 text-[13px] text-muted">
        Stock automatically deducts when an order is placed. Use this page to review availability and update inventory counts.
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
            <td className="px-5 py-4"><button onClick={() => openStockModal(product)} className="rounded-[3px] border border-border px-3 py-2 text-[12px] font-bold">Update Stock</button></td>
          </tr>
        ))}
      </AdminTable>
      {stockModalProduct && (
        <StockUpdateModal
          product={stockModalProduct}
          stockValue={stockValue}
          error={stockError}
          saving={savingStock}
          onChange={setStockValue}
          onClose={closeStockModal}
          onSubmit={handleStockUpdate}
        />
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

function StockUpdateModal({ product, stockValue, error, saving, onChange, onClose, onSubmit }) {
  const numericStock = Number(stockValue)
  const previewTone = Number.isInteger(numericStock) && numericStock >= 0
    ? numericStock === 0 ? "bad" : numericStock < 10 ? "warn" : "good"
    : "warn"
  const previewLabel = Number.isInteger(numericStock) && numericStock >= 0
    ? numericStock === 0 ? "Out of stock" : numericStock < 10 ? "Low stock" : "Available"
    : "Needs valid stock"

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="w-full max-w-[520px] rounded-[6px] border border-border bg-cream p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="eyebrow mb-2">Inventory Update</p>
            <h2 className="font-display text-[34px] leading-tight">Update stock</h2>
            <p className="mt-2 text-[14px] font-semibold text-muted">{product.brand} {product.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-[3px] border border-border px-3 py-2 text-[12px] font-bold">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 rounded-[5px] border border-border bg-parchment p-5 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-faint">Current Stock</p>
            <p className="mt-2 font-display text-[32px]">{product.stock}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-faint">New Indicator</p>
            <div className="mt-3">
              <StatusPill tone={previewTone}>{previewLabel}</StatusPill>
            </div>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-[12px] font-bold text-muted">New Stock Quantity</span>
          <input
            type="number"
            min="0"
            step="1"
            value={stockValue}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[14px] font-semibold outline-none focus:border-bronze"
            placeholder="0"
            autoFocus
          />
        </label>

        {error && <p className="mt-4 rounded-[4px] bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-[3px] border border-border px-5 py-3 text-[13px] font-bold text-ink">
            Cancel
          </button>
          <button disabled={saving} className="rounded-[3px] bg-ink px-5 py-3 text-[13px] font-bold text-cream disabled:opacity-60">
            {saving ? "Updating..." : "Review Update"}
          </button>
        </div>
      </form>
    </div>
  )
}
