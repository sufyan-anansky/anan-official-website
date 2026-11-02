import type { Variants } from "framer-motion";

export const mobileMenuVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

export const mobileMenuListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
  },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

export const mobileMenuItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};
