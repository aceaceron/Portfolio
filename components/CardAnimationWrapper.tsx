"use client";
import { motion, useInView, Variants } from "framer-motion";
import * as React from "react";

// Define variants for the elements *inside* the card
export const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Animation variants for the project cards container
const cardContainerVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
};

// ✅ Fully typed props including children
type CardAnimationWrapperProps = React.PropsWithChildren<{
  index?: number;
}> & React.ComponentProps<typeof motion.div>;

export default function CardAnimationWrapper({
  children,
  className = "",
  style,
  index = 0,
  ...props
}: CardAnimationWrapperProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      variants={cardContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        delay: index * 0.15,
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
      className={className}
      style={style}
      {...props} // motion.div props
    >
      {children}
    </motion.div>
  );
}
