import { motion } from "framer-motion";
import { Hero } from "@/components/landing/Hero";
import { CountdownTimer } from "@/components/landing/CountdownTimer";
import { EventsSection } from "@/components/landing/EventsSection";
import { Navbar } from "@/components/layout/Navbar";
import { fadeIn } from "@/lib/animations";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Event Starts In</h2>
            <CountdownTimer />
          </div>
          
          <EventsSection />
        </motion.div>
      </main>
    </div>
  );
}
