import { StaticPage } from "./AboutUs"

export default function ContactUs() {
  return (
    <StaticPage eyebrow="Contact Us" title="Questions about your order or a fragrance?">
      <p>
        Visit our physical store in Baliuag, Bulacan or contact the shop for order concerns, stock availability, and fragrance recommendations.
      </p>
      <div className="grid gap-4 pt-3 sm:grid-cols-2">
        <Info label="Phone" value="0917 000 0000" />
        <Info label="Email" value="hello@scentora.test" />
        <Info label="Address" value="Baliuag, Bulacan, Philippines" />
        <Info label="Hours" value="Monday to Saturday, 9 AM - 6 PM" />
      </div>
    </StaticPage>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-[5px] border border-border bg-parchment p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-2 font-bold text-ink">{value}</p>
    </div>
  )
}
