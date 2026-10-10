export default function AboutUs() {
  return (
    <StaticPage eyebrow="About Us" title="A fragrance shop built around better choices.">
      <p>
        Scentora is a MERN ecommerce project for a perfume business, designed to help customers browse fragrance products, understand scent profiles, and place orders with confidence.
      </p>
      <p>
        The experience is inspired by premium fragrance boutiques: refined product photography, clear notes, simple checkout, and an interface that feels polished for everyday shoppers.
      </p>
    </StaticPage>
  )
}

export function StaticPage({ eyebrow, title, children }) {
  return (
    <main className="container-page py-16">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="heading-display max-w-[850px] text-[50px] md:text-[64px]">{title}</h1>
      <div className="mt-8 max-w-[760px] space-y-5 text-[15px] leading-8 text-muted">{children}</div>
    </main>
  )
}
