import { motion } from "framer-motion";
import { fadeIn, glowPulse } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Hero() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${
          "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      <motion.div
        variants={glowPulse}
        initial="initial"
        animate="pulse"
        className="relative z-10 text-center px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-6">
          Rendezvous_cse @ GITAM'25
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join us for two days of innovation, learning, and tech excitement at
          GITAM's premier CSE department tech fest.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="shadow-glow">
              Register Now
            </Button>
          </Link>
          <Link href="/events">
            <Button size="lg" variant="outline">
              View Events
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
