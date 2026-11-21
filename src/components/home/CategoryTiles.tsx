"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { useHydrated } from "@/hooks/use-hydrated";
import { categoryDetails, getCategoryLink } from "@/lib/categories";

const CategoryTiles = () => {
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
          description="Press a tile to see what each category covers."
        />

        <div className="mt-(--space-2xl) grid grid-cols-1 items-center gap-(--space-2xl) lg:grid-cols-12 lg:gap-(--gap-columns)">
          <ul className="grid grid-cols-2 gap-(--space-md) sm:grid-cols-3 lg:col-span-7">
            {categoryDetails.map((category, index) => (
              <motion.li
                key={`${category.name}-${animate ? "pop" : "still"}`}
                initial={animate ? { opacity: 0, y: 14 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  aria-pressed={selected === index}
                  aria-controls="category-panel"
                  onClick={() => setSelected(index)}
                  className="tile w-full"
                  style={
                    {
                      "--tile": category.tile,
                      "--tile-deep": category.tileDeep,
                      "--tile-ink": category.tileInk,
                    } as React.CSSProperties
                  }
                >
                  <span className="tile-number">{index + 1}</span>
                  <span className="tile-name">{category.short}</span>
                </button>
              </motion.li>
            ))}
          </ul>

          <div id="category-panel" aria-live="polite" className="lg:col-span-5">
            <h3 className="text-(length:--text-display-s)">{chosen.name}</h3>
            <p className="lead mt-(--space-lg) text-ink-2">{chosen.description}</p>
            <Link href={getCategoryLink(chosen.name)} className="text-link mt-(--space-xl) inline-block text-lg font-semibold">
              See {chosen.short.toLowerCase()} services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;
