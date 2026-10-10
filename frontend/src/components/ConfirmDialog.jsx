export default function ConfirmDialog({ title, message, confirmLabel, cancelLabel, tone, onCancel, onConfirm }) {
  const confirmClass = tone === "danger"
    ? "bg-rose-700 text-white hover:bg-rose-800"
    : "bg-ink text-cream hover:bg-ink-soft"

  return (
    <div className="confirm-backdrop fixed inset-0 z-[80] grid place-items-center bg-ink/55 px-4 backdrop-blur-sm">
      <section className="confirm-panel w-full max-w-[430px] rounded-[6px] border border-border bg-cream p-6 shadow-2xl">
        <p className="eyebrow mb-3">Confirmation</p>
        <h2 className="font-display text-[32px] leading-tight text-ink">{title}</h2>
        <p className="mt-4 text-[14px] leading-7 text-muted">{message}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[3px] border border-border px-5 py-3 text-[13px] font-bold text-ink transition-colors hover:bg-parchment"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-[3px] px-5 py-3 text-[13px] font-bold transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
