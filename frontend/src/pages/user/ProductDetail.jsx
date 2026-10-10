import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ProductCard from "../../components/ProductCard"
import { ArrowRight } from "../../components/Icons"
import { accordColors, formatPeso, products as fallbackProducts } from "../../data/catalog"
import { useCart } from "../../hooks/useCart"
import { useProduct } from "../../hooks/useProducts"

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { product } = useProduct(productId)
  const [quantity, setQuantity] = useState(1)

  function handleAddToCart(goToCart = true) {
    addItem(product, quantity)
    if (goToCart) navigate("/cart")
  }

  return (
    <main className="bg-cream">
      <div className="border-b border-border bg-parchment">
        <div className="container-page flex items-center gap-2 py-3 text-[12px] text-faint">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <span>/</span>
          <span className="font-semibold text-ink">{product.name}</span>
        </div>
      </div>

      <section className="container-page grid gap-12 py-12 lg:grid-cols-[430px_1fr]">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-[6px] border border-border bg-parchment">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[product.image, ...fallbackProducts.slice(1, 3).map((item) => item.image)].map((image) => (
              <div key={image} className="aspect-square overflow-hidden rounded-[4px] border border-border bg-parchment">
                <img src={image} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-start justify-between gap-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze">{product.brand}</p>
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
          <h1 className="heading-display text-[48px] md:text-[62px]">{product.name}</h1>
          <p className="mt-2 font-display text-[21px] italic text-muted">Eau de Parfum · {product.size}</p>
          <p className="mt-6 max-w-[560px] text-[15px] leading-8 text-muted">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.accords.map((accord) => (
              <span key={accord.name} className="rounded-full border border-border bg-parchment px-4 py-2 text-[12px] font-semibold text-muted">
                {accord.name}
              </span>
            ))}
            <span className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-cream">{product.category}</span>
          </div>

          <div className="mt-8 border-y border-border-faint py-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">Price</p>
            <p className="mt-1 font-display text-[32px]">{formatPeso(product.price)}</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-[160px_1fr]">
            <div>
              <label className="mb-2 block text-[12px] font-bold text-muted">Quantity</label>
              <div className="flex h-11 overflow-hidden rounded-[4px] border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 bg-parchment text-lg">-</button>
                <span className="flex flex-1 items-center justify-center text-[14px] font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-11 bg-parchment text-lg">+</button>
              </div>
            </div>
            <div className="flex items-end gap-3">
              <button onClick={() => handleAddToCart(true)} className="flex flex-1 items-center justify-center gap-2 rounded-[3px] bg-bronze px-6 py-3 text-[13.5px] font-bold text-cream transition-colors hover:bg-bronze-light">
                Add to Cart <ArrowRight />
              </button>
              <button onClick={() => { handleAddToCart(false); navigate("/checkout") }} className="rounded-[3px] border border-border px-6 py-3 text-[13.5px] font-bold text-ink transition-colors hover:bg-parchment">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-parchment py-12">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Scent Profile</p>
            <h2 className="heading-display mb-7 text-[36px]">Main Accords</h2>
            <div className="space-y-3">
              {product.accords.map((accord) => (
                <div key={accord.name} className="flex items-center gap-4">
                  <span className="w-20 text-right text-[13px] text-muted">{accord.name}</span>
                  <div className="h-7 flex-1 overflow-hidden rounded-[3px] bg-cream">
                    <div className="flex h-full items-center px-3 text-[11px] font-bold text-cream" style={{ width: `${accord.pct}%`, backgroundColor: accordColors[accord.name] }}>
                      {accord.pct}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-3">Fragrance Notes</p>
            <h2 className="heading-display mb-7 text-[36px]">Top, Middle, Base</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(product.notes).map(([group, notes]) => (
                <div key={group} className="rounded-[5px] border border-border bg-cream p-5">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-bronze">{group}</p>
                  <div className="space-y-2">
                    {notes.map((note) => <p key={note} className="text-[13px] font-semibold text-muted">{note}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="eyebrow mb-3">Explore More</p>
        <h2 className="heading-display mb-9 text-[40px]">You may also like</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {fallbackProducts.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>
    </main>
  )
}
