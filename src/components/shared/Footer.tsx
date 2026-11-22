import Link from "next/link";
import Logo from "./Logo";
import { categories } from "@/lib/categories";
import { publicNavLinks, siteConfig } from "@/lib/site";

const exploreLinks = [...publicNavLinks, { href: "/signup?role=vendor", label: "List your services" }];

const Footer = () => {
  const { email, phone } = siteConfig.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="band mt-auto">
      <div className="container grid grid-cols-1 gap-y-(--space-xl) gap-x-(--gap-columns) py-(--space-3xl) sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-(--space-md) max-w-[36ch] text-ink-2">{siteConfig.description}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="font-body text-sm tracking-normal text-ink-3">Explore</h2>
          <ul className="mt-(--space-md) space-y-(--space-xs)">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-2 transition-colors duration-(--dur-short) hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-body text-sm tracking-normal text-ink-3">Categories</h2>
          <ul className="mt-(--space-md) space-y-(--space-xs)">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="text-ink-2 transition-colors duration-(--dur-short) hover:text-ink"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-body text-sm tracking-normal text-ink-3">Contact</h2>
          <ul className="mt-(--space-md) space-y-(--space-xs) text-ink-2">
            <li>
              {email ? (
                <a href={`mailto:${email}`} className="text-link">
                  {email}
                </a>
              ) : (
                <span className="fill" data-fill="email">
                  Contact email to be added
                </span>
              )}
            </li>
            <li>
              {phone ? (
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-link">
                  {phone}
                </a>
              ) : (
                <span className="fill" data-fill="phone">
                  Phone number to be added
                </span>
              )}
            </li>
          </ul>
          <ul className="mt-(--space-lg) flex flex-wrap gap-x-(--space-lg) gap-y-(--space-xs)">
            {siteConfig.social.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="container flex flex-col gap-(--space-xs) py-(--space-lg) text-sm text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} WedPlan. All rights reserved.</p>
          <p>Made for couples and wedding vendors in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
