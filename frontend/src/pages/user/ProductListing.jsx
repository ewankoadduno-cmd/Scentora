import { useMemo, useState } from "react"
import ProductCard from "../../components/ProductCard"
import { SearchIcon } from "../../components/Icons"
import { useProducts } from "../../hooks/useProducts"

const categories = ["Men", "Women", "Unisex"]
const families = ["Fresh", "Citrus", "Woody", "Amber", "Vanilla", "Oud", "Floral"]
const sizes = ["50ml", "100ml", "105ml"]

export default function ProductListing() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [family, setFamily] = useState("")
  const [sort, setSort] = useState("newest")
  const { products, loading, source } = useProducts({ search, category, family, sort })

  const filtered = useMemo(() => {
    return products
      .filter((product) => !category || product.category === category)
      .filter((product) => !family || product.family === family)
      .filter((product) => {
        const haystack = `${product.brand} ${product.name} ${product.family}`.toLowerCase()
        return haystack.includes(search.toLowerCase())
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price
        if (sort === "price-high") return b.price - a.price
        return b.id.localeCompare(a.id)
      })
  }, [category, family, products, search, sort])

  return (
    <main className="min-h-screen bg-cream">
      <section className="border-b border-border bg-parchment">
        <div className="container-page py-14">
          <p className="eyebrow mb-3">Catalog</p>
          <h1 className="heading-display text-[52px] md:text-[64px]">Shop Fragrances</h1>
          <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-muted">
            Search by keyword, filter by category, size, and scent family, then choose the fragrance that fits your day.
          </p>
          <div className="relative mt-8 max-w-[640px]">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, brand, note, or mood..."
              className="w-full rounded-[4px] border border-border bg-cream py-3 pl-11 pr-4 text-[14px] outline-none transition-colors focus:border-bronze"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-9">
        <div className="flex gap-9">
          <aside className="hidden w-[245px] shrink-0 lg:block">
            <div className="sticky top-[86px]">
              <FilterGroup title="Category" items={categories} value={category} setValue={setCategory} />
              <FilterGroup title="Fragrance Family" items={families} value={family} setValue={setFamily} />
              <FilterGroup title="Size" items={sizes} value="" setValue={() => {}} />
              <div className="border-t border-border-faint pt-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">Price Range</p>
                <div className="rounded-[5px] border border-border bg-parchment px-4 py-3 text-[12.5px] text-muted">
                  ₱1,000 - ₱3,000
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[13px] text-muted">
                <span className="font-bold text-ink">{filtered.length}</span> products found
                <span className="ml-2 text-[11px] text-faint">{loading ? "Loading..." : source === "database" ? "from MongoDB" : "fallback data"}</span>
              </p>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-[3px] border border-border bg-cream px-3 py-2 text-[12.5px] outline-none focus:border-bronze"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price low to high</option>
                <option value="price-high">Price high to low</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function FilterGroup({ title, items, value, setValue }) {
  return (
    <div className="mb-6 border-b border-border-faint pb-6">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setValue(value === item ? "" : item)}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
              value === item
                ? "border-ink bg-ink text-cream"
                : "border-border bg-cream text-muted hover:border-bronze hover:text-ink"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
