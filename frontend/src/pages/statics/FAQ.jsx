import { StaticPage } from "./AboutUs"

const faqs = [
  ["Do I need an account to checkout?", "Yes, checkout is available for registered users so orders can be tracked under My Orders."],
  ["Can I cancel an order?", "Yes, orders can be cancelled while the status is still Pending."],
  ["How do I send payment proof?", "Use the Upload Payment Proof action on the order details page for online transfer payments."],
]

export default function FAQ() {
  return (
    <StaticPage eyebrow="FAQ" title="Frequently asked questions.">
      <div className="space-y-4">
        {faqs.map(([question, answer]) => (
          <div key={question} className="rounded-[5px] border border-border bg-parchment p-5">
            <h2 className="font-display text-[24px] text-ink">{question}</h2>
            <p className="mt-2 text-[14px] leading-7 text-muted">{answer}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  )
}
