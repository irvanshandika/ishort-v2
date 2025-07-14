"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInView({ children, className = "", delay = 0 }: FadeInViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}
