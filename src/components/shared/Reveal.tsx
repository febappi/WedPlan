"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useHydrated } from "@/hooks/use-hydrated";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

// Content is visible in the server HTML; the fade only starts once the page has hydrated
const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();

  if (!hydrated || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
