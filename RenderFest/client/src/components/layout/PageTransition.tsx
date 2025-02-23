import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.61, 1, 0.88, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.61, 1, 0.88, 1],
    },
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen relative"
      >
        {/* Retro grid background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-primary/5" />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(transparent 0%, transparent calc(100% - 1px), rgba(139, 92, 246, 0.1) 100%),
                               linear-gradient(90deg, transparent 0%, transparent calc(100% - 1px), rgba(139, 92, 246, 0.1) 100%)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {children}
      </motion.div>
    </AnimatePresence>
  );
}