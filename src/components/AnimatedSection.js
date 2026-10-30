"use client";

import { useEffect, useRef } from "react";

/** @type {IntersectionObserver | null} */
let observer = null;

// One shared observer for every reveal on the page; each element is
// revealed once and then unobserved.
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
  }
  return observer;
}

/** @param {number} delay */
function useReveal(delay) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }
    const io = getObserver();
    io.observe(element);
    return () => io.unobserve(element);
  }, []);

  return { ref, style: delay ? { "--reveal-delay": `${delay}s` } : undefined };
}

/**
 * @param {{ children: React.ReactNode; className?: string; id?: string; delay?: number }} props
 */
export default function AnimatedSection({ children, className = "", id, delay = 0 }) {
  const { ref, style } = useReveal(delay);

  return (
    <section ref={ref} id={id} style={style} className={`reveal reveal-section ${className}`}>
      {children}
    </section>
  );
}

/**
 * @param {{ children: React.ReactNode; className?: string; delay?: number }} props
 */
export function AnimatedReveal({ children, className = "", delay = 0 }) {
  const { ref, style } = useReveal(delay);

  return (
    <div ref={ref} style={style} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
