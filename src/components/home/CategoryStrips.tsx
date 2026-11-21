"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { useHydrated } from "@/hooks/use-hydrated";
import { categoryDetails, getCategoryLink } from "@/lib/categories";
import { cn } from "@/lib/utils";

const CategoryStrips = () => {
  const [selected, setSelected] = useState(0);
  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion();
  const animate = hydrated && !reduceMotion;
  const chosen = categoryDetails[selected];

  return (
    <section aria-labelledby="categories-title" className="py-(--section-gap)">
      <div className="container">
        <SectionHeading
          id="categories-title"
          title="Six kinds of wedding vendor"
          description="Pick a strip to see what each category covers."
        />

        <div className="mt-(--space-2xl) grid grid-cols-1 items-center gap-(--space-2xl) lg:grid-cols-12 lg:gap-(--gap-columns)">
          <div className="lg:col-span-6">
            <div className="strip-rail">
              <ul className="flex justify-between gap-(--space-xs) sm:justify-start sm:gap-(--space-md)">
                {categoryDetails.map((category, index) => (
                  <li key={category.name} className="strip-hang">
                    <button
                      type="button"
                      aria-pressed={selected === index}
                      aria-controls="category-panel"
                      onClick={() => setSelected(index)}
                      className={cn("strip", selected === index && "strip-chosen")}
                      style={{ "--stain": category.stain } as React.CSSProperties}
                    >
                      <motion.span
                        key={animate ? "unfurl" : "still"}
                        className="strip-paper"
                        initial={animate ? { scaleY: 0.2, opacity: 0 } : false}
                        whileInView={{ scaleY: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.42, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="strip-number">No. {index + 1}</span>
                        <span className="strip-name">{category.short}</span>
                      </motion.span>
                      <span className="sr-only">{category.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="category-panel" aria-live="polite" className="lg:col-span-5 lg:col-start-8">
            <p className="text-sm text-pencil">No. {selected + 1} of {categoryDetails.length}</p>
            <h3 className="mt-(--space-sm) text-(length:--text-display-s) leading-[1.05] font-light">{chosen.name}</h3>
            <p className="lead mt-(--space-lg) text-ink-2">{chosen.description}</p>
            <Link href={getCategoryLink(chosen.name)} className="text-link mt-(--space-xl) inline-block">
              See {chosen.short.toLowerCase()} services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryStrips;
