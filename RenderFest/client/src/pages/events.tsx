import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { fadeIn, slideIn } from "@/lib/animations";
import { Calendar, Users, Trophy, Timer } from "lucide-react";
import type { Event } from "@shared/schema";

export default function Events() {
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return <Trophy className="w-5 h-5" />;
      case "workshop":
        return <Users className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Upcoming Events
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our exciting lineup of technical competitions, workshops, and networking events.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event, index) => (
            <motion.div
              key={event.id}
              variants={slideIn}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className="glassmorphism overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-400" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline"
                      className="capitalize bg-primary/10 text-primary border-primary/20"
                    >
                      {event.type}
                    </Badge>
                    <div className="text-muted-foreground">
                      ₹{event.price}
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2 mt-2">
                    {getEventIcon(event.type)}
                    {event.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="w-4 h-4" />
                      <div>
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </div>
                    </div>
                    
                    {event.maxTeamSize > 1 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <div>Team size: up to {event.maxTeamSize} members</div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                      <Link href={`/register?event=${event.id}`}>
                        <Button className="w-full ml-2">
                          Register Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
