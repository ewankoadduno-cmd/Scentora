import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import ConfirmDialog from "./ConfirmDialog"
import { useAuth } from "../hooks/useAuth"
import { useConfirmDialog } from "../hooks/useConfirmDialog"

const links = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Inventory", "/admin/inventory"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
]

export default function AdminLayout({ title, eyebrow, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()
  const showBackButton = location.pathname !== "/admin"

  async function handleLogout() {
    const confirmed = await confirm({
      title: "Log out of the admin console?",
      message: "Any unsaved form changes will stay on this screen only until you leave it.",
      confirmLabel: "Log Out",
    })

    if (confirmed) logout()
  }

  return (
    <main className="no-page-reveal min-h-screen bg-parchment text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-[245px] border-r border-border bg-ink px-5 py-6 text-cream lg:block">
        <Link to="/" className="font-display text-[24px]">Scentora</Link>
        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/28">Admin Console</p>
        <nav className="mt-10 flex flex-col gap-2">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `admin-sidebar-item rounded-[4px] px-4 py-3 text-[13px] font-semibold ${
                  isActive ? "bg-bronze text-cream" : "text-white/50 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 space-y-2">
          <Link to="/" className="admin-sidebar-item block rounded-[3px] border border-white/12 px-4 py-3 text-center text-[12.5px] font-bold text-white/62 hover:border-white/20 hover:bg-white/10 hover:text-white">
            View Store
          </Link>
          <button onClick={handleLogout} className="admin-sidebar-item w-full rounded-[3px] bg-white/8 px-4 py-3 text-center text-[12.5px] font-bold text-white/62 hover:bg-white/10 hover:text-white">
            Logout
          </button>
        </div>
      </aside>

      <section className="lg:pl-[245px]">
        <header className="border-b border-border bg-cream">
          <div className="px-6 py-6 lg:px-10">
            {showBackButton && (
              <div className="mb-4 flex flex-wrap items-center gap-4 text-[12.5px] font-bold">
                <button
                  onClick={() => navigate(-1)}
                  className="text-muted transition-colors hover:text-ink"
                >
                  Back
                </button>
                <Link to="/admin" className="text-bronze transition-colors hover:text-ink">
                  Dashboard
                </Link>
              </div>
            )}
            <p className="eyebrow mb-2">{eyebrow}</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="heading-display text-[42px]">{title}</h1>
              <p className="text-[13px] font-semibold text-muted">{user?.name}</p>
            </div>
          </div>
        </header>
        <div className="px-6 py-8 lg:px-10">{children}</div>
      </section>
      {confirmRequest && (
        <ConfirmDialog
          {...confirmRequest}
          onCancel={() => closeConfirm(false)}
          onConfirm={() => closeConfirm(true)}
        />
      )}
    </main>
  )
}

export function AdminTable({ columns, children }) {
  return (
    <div className="overflow-hidden rounded-[5px] border border-border bg-cream">
      <table className="w-full min-w-[760px] text-left text-[13px]">
        <thead className="bg-parchment text-[10px] uppercase tracking-[0.16em] text-faint">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-4">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function StatusPill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-parchment text-muted",
    good: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    bad: "bg-rose-50 text-rose-700",
  }

  return <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${tones[tone]}`}>{children}</span>
}
