"use client";

import { motion, useReducedMotion } from "framer-motion";

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

/**
 * @param {{ children: React.ReactNode; className?: string; id?: string; delay?: number }} props
 */
export default function AnimatedSection({ children, className = "", id, delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ ...transition, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/**
 * @param {{ children: React.ReactNode; className?: string; delay?: number }} props
 */
export function AnimatedReveal({ children, className = "", delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4% 0px" }}
      transition={{ ...transition, duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
