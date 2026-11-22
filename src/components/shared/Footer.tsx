import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import Logo from "./Logo";
import { categoryDetails } from "@/lib/categories";
import { publicNavLinks, siteConfig } from "@/lib/site";

const exploreLinks = [...publicNavLinks, { href: "/signup?role=vendor", label: "List your services" }];

const headingClass = "font-body text-sm tracking-normal text-ink-3";
const linkClass = "inline-flex items-center gap-(--space-xs) py-(--space-2xs) text-sm text-ink-2 transition-colors duration-(--dur-short) hover:text-ink sm:text-base";

const Footer = () => {
  const { email, phone } = siteConfig.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="band mt-auto">
      {/* Phones: brand, then Explore and Categories side by side, then Contact across the full width */}
      <div className="container grid grid-cols-2 gap-x-(--space-lg) gap-y-(--space-xl) py-(--space-3xl) sm:grid-cols-3 sm:gap-x-(--gap-columns) lg:grid-cols-12">
        <div className="col-span-2 sm:col-span-3 lg:col-span-4">
          <Logo />
          <p className="mt-(--space-md) max-w-[36ch] text-sm text-ink-2 sm:text-base">{siteConfig.description}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className={headingClass}>Explore</h2>
          <ul className="mt-(--space-sm) space-y-(--space-3xs) sm:mt-(--space-md)">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className={headingClass}>Categories</h2>
          <ul className="mt-(--space-sm) space-y-(--space-3xs) sm:mt-(--space-md)">
            {categoryDetails.map((category) => (
              <li key={category.name}>
                <Link href={`/services?category=${encodeURIComponent(category.name)}`} className={linkClass}>
                  <span className="sm:hidden">{category.short}</span>
                  <span className="max-sm:hidden">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 min-w-0 sm:col-span-1 lg:col-span-3">
          <h2 className={headingClass}>Contact</h2>
          <ul className="mt-(--space-sm) space-y-(--space-3xs) sm:mt-(--space-md)">
            <li>
              {email ? (
                <a href={`mailto:${email}`} className={`${linkClass} max-w-full`}>
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{email}</span>
                </a>
              ) : (
                <span className="fill" data-fill="email">
                  Contact email to be added
                </span>
              )}
            </li>
            <li>
              {phone ? (
                <a href={`tel:${phone.replace(/\s/g, "")}`} className={linkClass}>
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  {phone}
                </a>
              ) : (
                <span className="fill" data-fill="phone">
                  Phone number to be added
                </span>
              )}
            </li>
          </ul>
          <ul className="mt-(--space-md) flex flex-wrap gap-(--space-xs)">
            {siteConfig.social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-8 items-center rounded-(--radius-pill) border border-rule px-(--space-sm) text-sm text-ink-2 transition-colors duration-(--dur-short) hover:border-ink-3 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="container flex flex-col items-center gap-(--space-2xs) py-(--space-lg) text-center text-xs text-ink-3 text-balance sm:text-sm md:flex-row md:justify-between md:text-left">
          <p>
            &copy; {year} WedPlan. <span className="whitespace-nowrap">All rights reserved.</span>
          </p>
          <p>Made for couples and wedding vendors in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
