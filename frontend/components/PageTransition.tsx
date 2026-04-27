"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} initial={reduceMotion ? "visible" : "hidden"} animate="visible" exit={reduceMotion ? "visible" : "exit"} variants={variants}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
