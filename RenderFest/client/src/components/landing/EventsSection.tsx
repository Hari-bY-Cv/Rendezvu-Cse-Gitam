import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { slideIn } from "@/lib/animations";
import { Calendar, Code, Video, Gamepad } from "lucide-react";

const events = [
  {
    title: "Hackathon",
    icon: Code,
    description: "48-hour coding challenge with exciting prizes",
    price: "₹200",
    image: "https://images.unsplash.com/photo-1607969892192-8aa9fe65ee26"
  },
  {
    title: "Workshops",
    icon: Calendar,
    description: "Industry expert-led technical workshops",
    price: "₹100",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    title: "Webinars",
    icon: Video,
    description: "Online sessions on cutting-edge technologies",
    price: "₹50",
    image: "https://images.unsplash.com/photo-1591380816222-28cec94b49c8"
  },
  {
    title: "Non-Technical Events",
    icon: Gamepad,
    description: "Fun activities and networking opportunities",
    price: "₹50",
    image: "https://images.unsplash.com/photo-1607969891751-1374d59ab4fa"
  }
];

export function EventsSection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />

      <motion.h2
        variants={slideIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-12 relative z-10 text-gradient"
      >
        Featured Events
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
        {events.map((event, index) => (
          <motion.div
            key={event.title}
            variants={slideIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Card className="group glassmorphism hover:shadow-glow transition-all duration-300">
              <div 
                className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <event.icon className="w-5 h-5 text-primary animate-pulse-glow" />
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <div className="text-xl font-bold text-gradient">{event.price}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}