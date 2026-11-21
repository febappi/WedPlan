import Reveal from "@/components/shared/Reveal";

const reasons = [
  {
    title: "Every listing is reviewed",
    text: "An admin approves each service before couples can see it, and can take it down later.",
  },
  {
    title: "Requests cost you nothing",
    text: "Sending a booking request is free. Couples never pay WedPlan.",
  },
  {
    title: "Compare before you ask",
    text: "Filter by category and city, sort by price, then read the full listing.",
  },
  {
    title: "A status you can follow",
    text: "Each request shows pending, accepted, rejected or cancelled in your dashboard.",
  },
];

const WhyChooseWedPlan = () => {
  return (
    <section aria-labelledby="why-title" className="border-y border-rule bg-paper-2 py-(--section-gap-s)">
      <div className="container grid grid-cols-1 gap-(--space-2xl) lg:grid-cols-12 lg:gap-(--gap-columns)">
        <div className="lg:col-span-4">
          <h2 id="why-title">Why choose WedPlan</h2>
          <p className="lead mt-(--space-md) text-ink-2">What changes when your vendors are in one place.</p>
        </div>

        <Reveal className="lg:col-span-7 lg:col-start-6">
          <dl className="ruled">
            {reasons.map((reason) => (
              <div key={reason.title} className="grid grid-cols-1 gap-(--space-xs) py-(--space-lg) sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-(--gap-columns)">
                <dt className="font-display text-(length:--text-title) leading-tight text-ink">{reason.title}</dt>
                <dd className="m-0 text-ink-2">{reason.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyChooseWedPlan;
