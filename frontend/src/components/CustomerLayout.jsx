import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import ConfirmDialog from "./ConfirmDialog"
import { ArrowRight, CartIcon, SearchIcon, UserIcon } from "./Icons"
import { useAuth } from "../hooks/useAuth"
import { useCart } from "../hooks/useCart"
import { useConfirmDialog } from "../hooks/useConfirmDialog"

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Policy", to: "/shipping-return" },
]

export default function CustomerLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()
  const { count } = useCart()
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()
  const showBackBar = location.pathname !== "/"
  const isAdmin = user?.role === "admin"
  const showCustomerActions = !loading && !isAdmin
  const visibleNavLinks = showCustomerActions && user
    ? [...navLinks, { label: "Orders", to: "/orders" }]
    : navLinks

  async function handleLogout() {
    const confirmed = await confirm({
      title: "Log out of your account?",
      message: "You can still browse the shop, but checkout and order history will require logging in again.",
      confirmLabel: "Log Out",
    })

    if (confirmed) logout()
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur-sm">
        <div className="container-page flex h-[64px] items-center justify-between gap-5">
          <NavLink to="/" className="font-display text-[21px] font-medium text-ink">
            Scentora
          </NavLink>

          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-muted md:flex">
            {visibleNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => isActive ? "text-ink" : "transition-colors hover:text-ink"}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <NavLink to="/shop" className="rounded-[3px] p-2 text-muted transition-colors hover:text-ink" aria-label="Search">
              <SearchIcon />
            </NavLink>
            {showCustomerActions && (
              <NavLink to="/cart" className="relative rounded-[3px] p-2 text-muted transition-colors hover:text-ink" aria-label="Cart">
                <CartIcon />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-bronze px-1 text-[10px] font-bold text-cream">
                    {count}
                  </span>
                )}
              </NavLink>
            )}
            {showCustomerActions && user && (
              <NavLink to="/orders" className="hidden h-9 w-[86px] items-center justify-center rounded-[3px] border border-border bg-cream px-4 text-[12.5px] font-bold text-ink transition-colors hover:border-bronze hover:text-bronze sm:inline-flex">
                Orders
              </NavLink>
            )}
            {!loading && (
              <NavLink to={isAdmin ? "/admin" : user ? "/account" : "/login"} className="hidden rounded-[3px] p-2 text-muted transition-colors hover:text-ink sm:block" aria-label={isAdmin ? "Admin dashboard" : "Account"}>
                <UserIcon />
              </NavLink>
            )}
            {!loading && (
              isAdmin ? (
                <NavLink to="/admin" className="hidden h-9 w-[86px] items-center justify-center rounded-[3px] bg-ink px-4 text-[12.5px] font-bold text-cream transition-colors hover:bg-ink-soft sm:inline-flex">
                  Admin
                </NavLink>
              ) : user ? (
                <button
                  onClick={handleLogout}
                  className="hidden h-9 w-[86px] items-center justify-center rounded-[3px] bg-ink px-4 text-[12.5px] font-bold text-cream transition-colors hover:bg-ink-soft sm:inline-flex"
                >
                  Logout
                </button>
              ) : (
                <NavLink to="/login" className="hidden h-9 w-[86px] items-center justify-center rounded-[3px] bg-ink px-4 text-[12.5px] font-bold text-cream transition-colors hover:bg-ink-soft sm:inline-flex">
                  Login
                </NavLink>
              )
            )}
          </div>
        </div>
      </header>

      {showBackBar && (
        <div className="border-b border-border-faint bg-parchment/70">
          <div className="container-page flex h-11 items-center justify-between gap-3 text-[12.5px]">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 font-bold text-muted transition-colors hover:text-ink"
            >
              <span className="rotate-180"><ArrowRight /></span>
              Back
            </button>
            <NavLink to="/" className="font-bold text-bronze transition-colors hover:text-ink">
              Go to main page
            </NavLink>
          </div>
        </div>
      )}

      <Outlet />

      {confirmRequest && (
        <ConfirmDialog
          {...confirmRequest}
          onCancel={() => closeConfirm(false)}
          onConfirm={() => closeConfirm(true)}
        />
      )}

      <footer className="bg-ink py-14 text-cream">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <p className="font-display text-[22px]">Scentora</p>
              <p className="mt-3 max-w-[260px] text-[13px] leading-7 text-white/42">
                Premium fragrance shopping for signature scents, thoughtful gifts, and everyday favorites.
              </p>
            </div>
            {[
              ["Shop", "All Products", "Men", "Women", "Gift Sets"],
              ["Support", "Contact Us", "Shipping", "Returns", "FAQ"],
              ["Account", "Profile", "Orders", "Checkout", "Admin"],
            ].map(([title, ...links]) => (
              <div key={title}>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">{title}</p>
                <div className="flex flex-col gap-3">
                  {links.map((link) => (
                    <span key={link} className="text-[12.5px] text-white/46">{link}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-white/10 pt-7 text-[11.5px] text-white/30">
            © 2026 Scentora. MERN ecommerce project.
          </div>
        </div>
      </footer>
    </div>
  )
}
