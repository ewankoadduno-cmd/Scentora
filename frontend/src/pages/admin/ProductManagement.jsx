import { useState } from "react"
import AdminLayout, { AdminTable, StatusPill } from "../../components/AdminLayout"
import ConfirmDialog from "../../components/ConfirmDialog"
import { createProduct, deleteProduct, updateProduct } from "../../api/products"
import { formatPeso } from "../../data/catalog"
import { useAuth } from "../../hooks/useAuth"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"
import { useProducts } from "../../hooks/useProducts"

const categories = ["Men", "Women", "Unisex", "Body Mist", "Perfume Oil", "Gift Sets"]

const emptyProduct = {
  slug: "",
  brand: "",
  name: "",
  category: "Unisex",
  size: "100ml",
  price: "",
  oldPrice: "",
  stock: "",
  badge: "",
  family: "",
  image: "",
  description: "",
  notesTop: "",
  notesMiddle: "",
  notesBase: "",
}

export default function ProductManagement() {
  const { token } = useAuth()
  const { products, source, refetch } = useProducts()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()

  function openAddModal() {
    setEditingSlug(null)
    setForm(emptyProduct)
    setError("")
    setModalOpen(true)
  }

  function openEditModal(product) {
    setEditingSlug(product.slug)
    setForm({
      slug: product.slug,
      brand: product.brand,
      name: product.name,
      category: product.category,
      size: product.size,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      stock: String(product.stock),
      badge: product.badge || "",
      family: product.family,
      image: product.image,
      description: product.description,
      notesTop: product.notes?.top?.join(", ") || "",
      notesMiddle: product.notes?.middle?.join(", ") || "",
      notesBase: product.notes?.base?.join(", ") || "",
    })
    setError("")
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    const confirmed = await confirm({
      title: editingSlug ? "Save product changes?" : "Create this product?",
      message: editingSlug
        ? "This will update the product details shown in the customer shop and admin inventory."
        : "This will add a new product record to MongoDB and make it available in the shop.",
      confirmLabel: editingSlug ? "Save Changes" : "Create Product",
    })

    if (!confirmed) return

    setSubmitting(true)

    const payload = {
      slug: form.slug,
      brand: form.brand,
      name: form.name,
      category: form.category,
      size: form.size,
      price: form.price,
      oldPrice: form.oldPrice,
      stock: form.stock,
      badge: form.badge,
      family: form.family,
      image: form.image,
      description: form.description,
      notes: {
        top: splitList(form.notesTop),
        middle: splitList(form.notesMiddle),
        base: splitList(form.notesBase),
      },
    }

    try {
      if (editingSlug) {
        await updateProduct(editingSlug, payload, token)
      } else {
        await createProduct(payload, token)
      }

      await refetch()
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(product) {
    const confirmed = await confirm({
      title: "Deactivate this product?",
      message: `${product.brand} ${product.name} will no longer appear in the shop. Existing orders will keep their saved item details.`,
      confirmLabel: "Deactivate Product",
      tone: "danger",
    })

    if (!confirmed) return

    try {
      await deleteProduct(product.slug, token)
      await refetch()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminLayout eyebrow="Catalog" title="Products Management">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-muted">
          Manage product records, prices, stock, and visibility. Data source: {source === "database" ? "MongoDB" : "fallback catalog"}.
        </p>
        <button onClick={openAddModal} className="rounded-[3px] bg-ink px-5 py-3 text-[13px] font-bold text-cream">
          Add Product
        </button>
      </div>

      {error && <p className="mb-4 rounded-[4px] bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">{error}</p>}

      <AdminTable columns={["Product", "Category", "Price", "Stock", "Status", "Actions"]}>
        {products.map((product) => (
          <tr key={product.id} className="border-t border-border-faint">
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={product.image} alt="" className="h-12 w-12 rounded-[4px] object-cover" />
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-[12px] text-muted">{product.brand}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-4 text-muted">{product.category}</td>
            <td className="px-5 py-4 font-bold">{formatPeso(product.price)}</td>
            <td className="px-5 py-4 text-muted">{product.stock}</td>
            <td className="px-5 py-4"><StatusPill tone={product.stock > 0 ? "good" : "bad"}>{product.stock > 0 ? "Active" : "Out of stock"}</StatusPill></td>
            <td className="px-5 py-4">
              <div className="flex gap-2">
                <button onClick={() => openEditModal(product)} className="rounded-[3px] border border-border px-3 py-2 text-[12px] font-bold">Edit</button>
                <button onClick={() => handleDelete(product)} className="rounded-[3px] border border-border px-3 py-2 text-[12px] font-bold text-rose-700">Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {modalOpen && (
        <ProductModal
          editing={Boolean(editingSlug)}
          form={form}
          setForm={setForm}
          error={error}
          submitting={submitting}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
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

function ProductModal({ editing, form, setForm, error, submitting, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-[880px] overflow-y-auto rounded-[6px] border border-border bg-cream p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-5">
          <div>
            <p className="eyebrow mb-2">{editing ? "Edit Product" : "New Product"}</p>
            <h2 className="font-display text-[34px]">{editing ? "Update product details" : "Add a product"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-[3px] border border-border px-3 py-2 text-[12px] font-bold">
            Close
          </button>
        </div>

        {error && <p className="mb-4 rounded-[4px] bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(slug) => setFormValue(setForm, "slug", slug)} placeholder="lattafa-khamrah" />
          <Field label="Brand" value={form.brand} onChange={(brand) => setFormValue(setForm, "brand", brand)} placeholder="Lattafa" />
          <Field label="Name" value={form.name} onChange={(name) => setFormValue(setForm, "name", name)} placeholder="Khamrah" />
          <label>
            <span className="mb-2 block text-[12px] font-bold text-muted">Category</span>
            <select value={form.category} onChange={(event) => setFormValue(setForm, "category", event.target.value)} className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze">
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <Field label="Size" value={form.size} onChange={(size) => setFormValue(setForm, "size", size)} placeholder="100ml" />
          <Field label="Fragrance Family" value={form.family} onChange={(family) => setFormValue(setForm, "family", family)} placeholder="Vanilla" />
          <Field label="Price" type="number" value={form.price} onChange={(price) => setFormValue(setForm, "price", price)} placeholder="1800" />
          <Field label="Old Price" type="number" value={form.oldPrice} onChange={(oldPrice) => setFormValue(setForm, "oldPrice", oldPrice)} placeholder="2200" />
          <Field label="Stock" type="number" value={form.stock} onChange={(stock) => setFormValue(setForm, "stock", stock)} placeholder="18" />
          <Field label="Badge" value={form.badge} onChange={(badge) => setFormValue(setForm, "badge", badge)} placeholder="Best Seller" />
          <Field label="Image URL" value={form.image} onChange={(image) => setFormValue(setForm, "image", image)} placeholder="https://..." wide />
          <Textarea label="Description" value={form.description} onChange={(description) => setFormValue(setForm, "description", description)} wide />
          <Field label="Top Notes" value={form.notesTop} onChange={(notesTop) => setFormValue(setForm, "notesTop", notesTop)} placeholder="Apple, Bergamot" />
          <Field label="Middle Notes" value={form.notesMiddle} onChange={(notesMiddle) => setFormValue(setForm, "notesMiddle", notesMiddle)} placeholder="Lavender, Orange Blossom" />
          <Field label="Base Notes" value={form.notesBase} onChange={(notesBase) => setFormValue(setForm, "notesBase", notesBase)} placeholder="Vanilla, Amber" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-[3px] border border-border px-5 py-3 text-[13px] font-bold text-ink">
            Cancel
          </button>
          <button disabled={submitting} className="rounded-[3px] bg-ink px-5 py-3 text-[13px] font-bold text-cream disabled:opacity-60">
            {submitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = "text", wide = false }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-[12px] font-bold text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze"
      />
    </label>
  )
}

function Textarea({ label, value, onChange, wide = false }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-[12px] font-bold text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze"
      />
    </label>
  )
}

function setFormValue(setForm, field, value) {
  setForm((previous) => ({ ...previous, [field]: value }))
}

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}
