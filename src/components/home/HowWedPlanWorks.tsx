import Reveal from "@/components/shared/Reveal";

const steps = [
  {
    title: "Pick a service",
    text: "Browse by category, search by name and narrow it down by city.",
  },
  {
    title: "Send a request",
    text: "Give the event date, the location and a short note for the vendor.",
  },
  {
    title: "Hear back",
    text: "The vendor accepts or declines, and your dashboard shows the answer.",
  },
];

const sampleFields = [
  { label: "Service", value: "Example Studio, wedding photography" },
  { label: "Event date", value: "Saturday, 14 February" },
  { label: "Event location", value: "Example community hall" },
];

const HowWedPlanWorks = () => {
  return (
    <section aria-labelledby="how-title" className="band band-ink mt-(--space-md) py-(--section-gap)">
      <div className="container grid grid-cols-1 items-center gap-(--space-2xl) lg:grid-cols-12 lg:gap-(--gap-columns)">
        <div className="lg:col-span-6">
          <h2 id="how-title">How WedPlan works</h2>
          <ol className="steps mt-(--space-2xl)">
            {steps.map((step) => (
              <li key={step.title} className="steps-item">
                <h3>{step.title}</h3>
                <p className="mt-(--space-xs) text-paper-3">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8">
          <div
            data-slot="booking"
            data-alt="a screenshot of the real booking request form on a service page"
            data-kind="product"
            className="stock p-(--space-xl) text-ink sm:p-(--space-2xl)"
          >
            <div className="flex items-baseline justify-between gap-(--space-md)">
              <p className="font-display text-(length:--text-title) font-semibold text-ink">Booking request</p>
              <span className="rounded-(--radius-pill) bg-pear px-(--space-sm) py-(--space-3xs) text-sm font-semibold text-pear-ink">Pending</span>
            </div>
            <dl className="mt-(--space-xl) space-y-(--space-lg)">
              {sampleFields.map((field) => (
                <div key={field.label}>
                  <dt className="text-sm text-ink-3">{field.label}</dt>
                  <dd className="m-0 mt-(--space-2xs) border-b border-rule pb-(--space-xs) text-ink">{field.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-sm text-ink-3">Message</dt>
                <dd className="m-0 mt-(--space-2xs) border-b border-rule pb-(--space-xs) text-ink">
                  Around 200 guests. Could you cover the reception as well?
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HowWedPlanWorks;
