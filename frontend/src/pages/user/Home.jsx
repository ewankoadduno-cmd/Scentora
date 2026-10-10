import { Link } from "react-router-dom"
import ProductCard from "../../components/ProductCard"
import { ArrowRight } from "../../components/Icons"
import { useProducts } from "../../hooks/useProducts"

const moods = [
  ["Men", "Confident daily scents", "https://images.unsplash.com/photo-1615160460524-432433ba1b8f?w=760&h=540&fit=crop&auto=format"],
  ["Women", "Soft, sweet, floral signatures", "https://images.unsplash.com/photo-1608721279136-cd41b752fa41?w=760&h=540&fit=crop&auto=format"],
  ["Unisex", "Balanced blends for anyone", "https://images.unsplash.com/photo-1627823569857-4d8581dc62b2?w=760&h=540&fit=crop&auto=format"],
  ["Body Mist", "Light everyday refreshers", "https://images.unsplash.com/photo-1613521076081-2820f9746a2d?w=760&h=540&fit=crop&auto=format"],
  ["Perfume Oil", "Compact long-wearing oils", "https://images.unsplash.com/photo-1643797517590-c44cb552ddcc?w=760&h=540&fit=crop&auto=format"],
  ["Gift Sets", "Ready-to-give fragrance picks", "https://images.unsplash.com/photo-1598634222670-87c5f558119c?w=760&h=540&fit=crop&auto=format"],
]

export default function Home() {
  const { products } = useProducts()
  const featuredProducts = products.slice(0, 4)

  return (
    <main>
      <section className="dark-grain relative overflow-hidden">
        <div className="container-page grid min-h-[calc(100vh-64px)] items-center gap-12 py-20 lg:grid-cols-[1fr_430px]">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-7 bg-bronze" />
              <p className="eyebrow">Fragrance ecommerce · Baliuag</p>
            </div>
            <h1 className="heading-display max-w-[620px] text-[58px] text-cream md:text-[80px] lg:text-[92px]">
              Find your <span className="block italic text-cream/45">signature</span> scent.
            </h1>
            <p className="mt-8 max-w-[500px] text-[15.5px] leading-8 text-white/50">
              Discover perfumes, body mists, oils, and gift sets for every mood, occasion, and personality.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-[3px] bg-bronze px-6 py-3 text-[13.5px] font-bold text-cream transition-colors hover:bg-bronze-light">
                Shop Now <ArrowRight />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-[3px] border border-white/15 px-6 py-3 text-[13.5px] font-semibold text-white/62 transition-colors hover:border-white/30 hover:text-white">
                About Scentora
              </Link>
            </div>
            <div className="mt-14 border-t border-white/10 pt-6">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Trending now</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {featuredProducts.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="text-[13px] text-white/50 transition-colors hover:text-white/80">
                    {product.brand} {product.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute inset-0 rounded-full bg-bronze/20 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1627823569857-4d8581dc62b2?w=900&h=1125&fit=crop&auto=format"
                alt="Luxury perfume bottle"
                className="h-full w-full object-cover"
              />
              <Link to="/products/lattafa-khamrah" className="absolute bottom-5 right-5 rounded-[5px] border border-white/10 bg-ink/82 px-4 py-3 text-left backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Featured</p>
                <p className="font-display text-[18px] text-cream">Lattafa Khamrah</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-parchment py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Right Now</p>
              <h2 className="heading-display text-[46px]">Featured Products</h2>
            </div>
            <Link to="/shop" className="hidden items-center gap-2 text-[13px] font-semibold text-muted transition-colors hover:text-ink sm:flex">
              View all <ArrowRight />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="container-page">
          <p className="eyebrow mb-3">Categories</p>
          <h2 className="heading-display mb-10 text-[46px]">Shop by Category</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {moods.map(([label, copy, image]) => (
              <Link key={label} to="/shop" className="group relative aspect-[4/3] overflow-hidden rounded-[5px] bg-parchment">
                <img src={image} alt={label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-[25px] text-cream">{label}</p>
                  <p className="mt-1 text-[12px] text-cream/62">{copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-soft py-20">
        <div className="container-page text-center">
          <p className="eyebrow mb-4">Online Shopping</p>
          <h2 className="heading-display mx-auto max-w-[760px] text-[42px] text-cream md:text-[56px]">
            Browse, add to cart, checkout, and track your order.
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[14.5px] leading-7 text-white/45">
            Built around the required ecommerce flow, with a fragrance boutique interface that feels polished for presentation.
          </p>
          <Link to="/shop" className="mt-9 inline-flex items-center gap-2 rounded-[3px] bg-bronze px-7 py-3 text-[13.5px] font-bold text-cream transition-colors hover:bg-bronze-light">
            Start Shopping <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  )
}
