import { Link } from "react-router-dom"
import { accordColors, formatPeso } from "../data/catalog"

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="motion-card group block overflow-hidden rounded-[5px] border border-border bg-cream text-left transition-all duration-300 hover:border-bronze/40"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-parchment">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-cream px-3 py-1 text-[10px] font-bold text-bronze shadow-sm">
            {product.badge}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-[10px] font-bold text-cream">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{product.brand}</p>
          <span className="text-[10.5px] text-faint">{product.category}</span>
        </div>
        <h3 className="font-display text-[19px] leading-snug text-ink">{product.name}</h3>
        <p className="mt-1 text-[12.5px] font-bold text-bronze">From {formatPeso(product.price)}</p>
        <div className="mt-3 border-t border-border-faint pt-3">
          {product.accords.map((accord) => (
            <div key={accord.name} className="mb-1.5 flex items-center gap-2 last:mb-0">
              <span className="w-14 shrink-0 text-right text-[10px] text-faint">{accord.name}</span>
              <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-parchment-dark">
                <div
                  className="accord-fill h-full rounded-full"
                  style={{ width: `${accord.pct}%`, backgroundColor: accordColors[accord.name] ?? "#a07848" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
