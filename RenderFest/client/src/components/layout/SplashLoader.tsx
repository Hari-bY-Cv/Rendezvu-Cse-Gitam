import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashLoaderProps {
  onFinish: () => void;
}

export function SplashLoader({ onFinish }: SplashLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 10, 100));
      } else {
        onFinish();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [progress, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Rendezvous_cse
          </h1>
          <div className="text-xl text-muted-foreground">GITAM'25</div>
        </motion.div>

        <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-400"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          Loading experience...
        </motion.div>
      </div>

      {/* Retro grid background */}
      <div className="absolute inset-0 -z-10">
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
    </motion.div>
  );
}
