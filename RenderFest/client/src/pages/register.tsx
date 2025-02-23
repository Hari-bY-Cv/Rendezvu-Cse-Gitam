import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpVerification } from "@/components/auth/OtpVerification";
import { PassSelection } from "@/components/registration/PassSelection";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { fadeIn } from "@/lib/animations";
import { Navbar } from "@/components/layout/Navbar";

type RegistrationStep = "details" | "verification" | "pass";

export default function Register() {
  const [step, setStep] = useState<RegistrationStep>("details");
  const [userId, setUserId] = useState<number>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      gitamId: "",
      semester: 1,
      attendance: 75
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await apiRequest("POST", "/api/register", data);
      const json = await response.json();
      setUserId(json.userId);
      setStep("verification");
      toast({
        title: "Check your email",
        description: "We've sent you a verification code.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please check your details and try again.",
      });
    }
  };

  const handleVerified = () => {
    setStep("pass");
  };

  const handlePassSelected = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-16"
      >
        {step === "details" && (
          <Card className="max-w-md mx-auto backdrop-blur-lg bg-card/50">
            <CardHeader>
              <CardTitle>Register for Rendezvous_cse</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GITAM Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="your.name@gitam.in" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gitamId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your GITAM ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" max="10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="attendance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attendance Percentage</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" max="100" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">Continue</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === "verification" && userId && (
          <OtpVerification userId={userId} onVerified={handleVerified} />
        )}

        {step === "pass" && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">Select Your Pass</h2>
            <PassSelection onSelect={handlePassSelected} />
          </div>
        )}
      </motion.main>
    </div>
  );
}
