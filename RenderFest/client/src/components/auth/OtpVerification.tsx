import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { scaleIn } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";

interface OtpVerificationProps {
  userId: number;
  onVerified: () => void;
}

export function OtpVerification({ userId, onVerified }: OtpVerificationProps) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/verify", { userId, code });
      toast({
        title: "Success",
        description: "Email verified successfully!",
      });
      onVerified();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-lg bg-card/50">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-wider"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={code.length !== 6 || isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
