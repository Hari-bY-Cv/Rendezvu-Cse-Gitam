import { type Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

export const slideIn: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } }
};

export const navItemHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.2 } }
};

export const glowPulse: Variants = {
  initial: { boxShadow: "0 0 0 rgba(139, 92, 246, 0)" },
  pulse: {
    boxShadow: [
      "0 0 20px rgba(139, 92, 246, 0.2)",
      "0 0 40px rgba(139, 92, 246, 0.4)",
      "0 0 20px rgba(139, 92, 246, 0.2)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};
