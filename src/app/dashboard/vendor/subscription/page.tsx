import type { Metadata } from "next";
import { Check } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { CancelSubscriptionButton, UpgradeButton } from "@/components/subscription/SubscriptionActions";
import { formatDate, formatMoney } from "@/lib/format";
import { getServerToken } from "@/lib/session";
import { PremiumPlan, SubscriptionInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subscription",
};

const freeFeatures = ["Up to 3 active services", "Basic vendor dashboard", "Booking request management"];
const premiumFeatures = ["Unlimited active services", "Premium vendor badge on every listing", "Everything in the free plan"];

const getData = async () => {
  const token = await getServerToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const [planRes, subRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/plan`, { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/subscription`, { cache: "no-store", headers }),
    ]);
    if (!planRes.ok || !subRes.ok) {
      return null;
    }
    return { plan: (await planRes.json()) as PremiumPlan, subscription: (await subRes.json()) as SubscriptionInfo };
  } catch {
    return null;
  }
};

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="mt-(--space-lg) space-y-(--space-sm)">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-(--space-xs) text-ink">
        <Check className="mt-0.5 size-4 shrink-0 text-mint-deep" aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
);

const SubscriptionPage = async () => {
  const data = await getData();

  if (!data) {
    return (
      <>
        <DashboardHeader title="Subscription" />
        <p className="stock p-(--space-xl) text-ink-2">Plan details could not load. Please refresh the page.</p>
      </>
    );
  }

  const { plan, subscription } = data;
  const endsOn = subscription.subscriptionExpiresAt ? formatDate(subscription.subscriptionExpiresAt) : "";

  return (
    <>
      <DashboardHeader
        title="Subscription"
        description={
          subscription.isPremium
            ? subscription.cancelAtPeriodEnd
              ? `Premium is cancelled and ends on ${endsOn}.`
              : `You are on Premium. It renews on ${endsOn}.`
            : "You are on the free plan."
        }
      />

      <div className="grid max-w-4xl grid-cols-1 gap-(--gap-columns) md:grid-cols-2">
        <section aria-labelledby="free-plan" className={cn("stock flex flex-col p-(--space-xl)", !subscription.isPremium && "outline-2 outline-ink")}>
          <div className="flex items-center justify-between gap-(--space-sm)">
            <h2 id="free-plan" className="text-(length:--text-title)">Free</h2>
            {!subscription.isPremium && <span className="rounded-(--radius-pill) bg-ink px-(--space-sm) py-(--space-3xs) text-xs font-semibold text-paper">Current plan</span>}
          </div>
          <p className="mt-(--space-sm) text-(length:--text-2xl) font-semibold text-ink">
            {formatMoney(0, plan.currency)}
            <span className="text-md font-medium text-ink-3"> a month</span>
          </p>
          <FeatureList items={freeFeatures} />
        </section>

        <section
          aria-labelledby="premium-plan"
          className={cn("flex flex-col rounded-(--radius-card) bg-pear bg-[image:var(--grain),var(--fibre)] p-(--space-xl) text-pear-ink shadow-(--shadow-card)", subscription.isPremium && "outline-2 outline-ink")}
        >
          <div className="flex items-center justify-between gap-(--space-sm)">
            <h2 id="premium-plan" className="text-(length:--text-title)">Premium</h2>
            {subscription.isPremium && <span className="rounded-(--radius-pill) bg-ink px-(--space-sm) py-(--space-3xs) text-xs font-semibold text-paper">Current plan</span>}
          </div>
          <p className="mt-(--space-sm) text-(length:--text-2xl) font-semibold">
            {formatMoney(plan.amount / 100, plan.currency)}
            <span className="text-md font-medium"> a {plan.interval}</span>
          </p>
          <FeatureList items={premiumFeatures} />
          <div className="mt-auto pt-(--space-xl)">
            {!subscription.isPremium && <UpgradeButton />}
            {subscription.isPremium && subscription.canCancel && <CancelSubscriptionButton endsOn={endsOn} />}
            {subscription.isPremium && subscription.cancelAtPeriodEnd && <p className="text-sm">Premium stays on until {endsOn}.</p>}
          </div>
        </section>
      </div>

      <p className="mt-(--space-lg) max-w-4xl text-sm text-ink-3">
        Payments go through Stripe Checkout in test mode. Premium turns on only after Stripe confirms the payment to WedPlan.
      </p>
    </>
  );
};

export default SubscriptionPage;
