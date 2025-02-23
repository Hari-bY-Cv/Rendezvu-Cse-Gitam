import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { fadeIn } from "@/lib/animations";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const eventDate = new Date("2025-03-05T09:00:00");

    const calculateTimeLeft = () => {
      const difference = eventDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="relative py-12 px-4"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10" />

      <div className="flex gap-4 justify-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <Card 
            key={unit} 
            className="relative p-6 glassmorphism animate-float"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
            <div className="relative">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {value.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {unit}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}