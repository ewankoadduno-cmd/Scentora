import ConfirmDialog from "../../components/ConfirmDialog"
import { useConfirmDialog } from "../../hooks/useConfirmDialog"

export default function MyAccount() {
  const { closeConfirm, confirm, confirmRequest } = useConfirmDialog()

  async function handleSave() {
    await confirm({
      title: "Save account changes?",
      message: "This MVP keeps the profile form ready for the account update API. Confirming here will not change your login credentials yet.",
      confirmLabel: "Understood",
    })
  }

  return (
    <main className="container-page py-12">
      <p className="eyebrow mb-3">Customer Profile</p>
      <h1 className="heading-display text-[52px]">My Account</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-[5px] border border-border bg-cream p-6">
          <h2 className="font-display text-[30px]">Profile Info</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value="Khristiane Cruz" />
            <Field label="Email" value="student@scentora.test" />
            <Field label="Contact Number" value="0917 000 0000" />
            <Field label="Password" value="••••••••" />
          </div>
          <button onClick={handleSave} className="mt-6 rounded-[3px] bg-ink px-5 py-3 text-[13px] font-bold text-cream">Save Changes</button>
        </section>
        <section className="rounded-[5px] border border-border bg-parchment p-6">
          <h2 className="font-display text-[30px]">Saved Delivery Address</h2>
          <p className="mt-4 max-w-[420px] text-[14px] leading-7 text-muted">
            123 Fragrance Street, Baliuag, Bulacan, Philippines
          </p>
          <button className="mt-6 rounded-[3px] border border-border bg-cream px-5 py-3 text-[13px] font-bold text-ink">Edit Address</button>
        </section>
      </div>
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

function Field({ label, value }) {
  return (
    <label>
      <span className="mb-2 block text-[12px] font-bold text-muted">{label}</span>
      <input defaultValue={value} className="w-full rounded-[4px] border border-border bg-parchment px-4 py-3 text-[13.5px] outline-none focus:border-bronze" />
    </label>
  )
}
