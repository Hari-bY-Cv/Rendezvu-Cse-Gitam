import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { fadeIn, slideIn } from "@/lib/animations";
import { Users, Search, Code, Trophy } from "lucide-react";
import type { Team, Event } from "@shared/schema";

export default function Teams() {
  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams/event/1"], // Hackathon event ID
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const hackathonEvent = events?.find(event => event.type === "hackathon");

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
            Hackathon Teams
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join existing teams or create your own to participate in our flagship hackathon event.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search teams by name or required skills..."
              className="pl-10 glassmorphism"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams?.map((team, index) => (
            <motion.div
              key={team.id}
              variants={slideIn}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="glassmorphism overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-400" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline"
                      className={`capitalize ${
                        team.status === "forming"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {team.status}
                    </Badge>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {team.currentSize}/{hackathonEvent?.maxTeamSize || 4}
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2 mt-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {team.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {team.requiredSkills?.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-primary/5">
                            <Code className="w-3 h-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href={`/teams/${team.id}`}>
                      <Button className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {teams?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No teams found. Be the first to create one!
          </div>
        )}
      </main>
    </div>
  );
}
