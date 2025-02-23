import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamFormation } from "@/components/registration/TeamFormation";
import { Navbar } from "@/components/layout/Navbar";
import { slideIn } from "@/lib/animations";
import type { Registration, Event } from "@shared/schema";

export default function Dashboard() {
  const { data: registrations } = useQuery<Registration[]>({
    queryKey: ["/api/registrations/1"], // TODO: Replace with actual userId
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          variants={slideIn}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="backdrop-blur-lg bg-card/50">
            <CardHeader>
              <CardTitle>Your Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {registrations?.map((registration) => {
                const event = events?.find((e) => e.id === registration.eventId);
                return (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span>{event?.name}</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        registration.status === "approved"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {registration.status}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-card/50">
            <CardHeader>
              <CardTitle>Hackathon Team</CardTitle>
            </CardHeader>
            <CardContent>
              {events?.find((e) => e.type === "hackathon") && (
                <TeamFormation
                  eventId={events.find((e) => e.type === "hackathon")!.id}
                  userId={1} // TODO: Replace with actual userId
                  maxTeamSize={3}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
