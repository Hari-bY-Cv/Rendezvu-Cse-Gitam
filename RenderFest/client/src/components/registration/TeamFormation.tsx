import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scaleIn } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";
import { insertTeamSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Users, UserPlus, Code, Trophy, Tag } from "lucide-react";

const AVAILABLE_SKILLS = [
  "Frontend", "Backend", "UI/UX", "DevOps",
  "Machine Learning", "Blockchain", "Mobile Dev",
  "Data Science", "Cloud Computing", "Cybersecurity"
];

interface TeamFormationProps {
  eventId: number;
  userId: number;
  maxTeamSize: number;
}

export function TeamFormation({ eventId, userId, maxTeamSize }: TeamFormationProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertTeamSchema),
    defaultValues: {
      name: "",
      description: "",
      requiredSkills: [],
      eventId
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const team = await apiRequest("POST", "/api/teams", {
        ...data,
        requiredSkills: selectedSkills,
        eventId,
        leaderId: userId
      });

      toast({
        title: "Team created!",
        description: "Your team has been created successfully.",
      });

      // Reset form and selected skills
      form.reset();
      setSelectedSkills([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create team. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="team-card">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary animate-pulse-glow" />
            Create Your Team
            <Badge variant="outline" className="ml-auto ticket-tag">
              <Tag className="w-3 h-3 mr-1" />
              Hackathon Registration
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="backdrop-blur-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Describe your team's goals and what you're looking for in teammates..."
                        className="backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedSkills.includes(skill)
                          ? "bg-secondary/20 text-secondary hover:bg-secondary/30"
                          : "hover:bg-secondary/10"
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      <Code className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
                {selectedSkills.length === 0 && (
                  <p className="text-sm text-destructive">Select at least one required skill</p>
                )}
              </div>

              <div className="registration-card p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-accent" />
                  Team Capacity
                </h4>
                <p className="text-sm text-muted-foreground">
                  You can add up to {maxTeamSize - 1} more members to your team.
                  Team members should have complementary skills to create a balanced team.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-glow-teal"
                disabled={isSubmitting || selectedSkills.length === 0}
              >
                {isSubmitting ? "Creating Team..." : "Create Team"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}