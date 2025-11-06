import { Variants, easeOut } from "framer-motion";

export const sectionContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const iconVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const nameVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut, delay: 0.5 } },
};

export const bounceHover = {
  scale: 1.05,
  boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
  transition: { duration: 0.3, ease: easeOut },
};

export const dotsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }, // each dot appears one after another
  },
};

export const dotVariants: Variants = {
  hidden: { scale: 0, opacity: 0, y: 4 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 12 },
  },
};
