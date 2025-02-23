import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { slideIn } from "@/lib/animations";
import { Check, Sparkles, ShoppingCart, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useQuery } from "@tanstack/react-query";
import type { User, Event } from "@shared/schema";

interface PassSelectionProps {
  userVerified?: boolean;
}

export function PassSelection({ userVerified }: PassSelectionProps) {
  const { items, addToCart } = useCart();
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const isPassInCart = (eventId: number) => {
    return items.some(item => item.event.id === eventId);
  };

  const showAttendanceWarning = user?.attendance && user.attendance < 75;

  return (
    <div className="space-y-6">
      {showAttendanceWarning && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Your attendance is below 75%. Please contact your HOD for special permission.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events?.map((event, index) => (
          <motion.div
            key={event.id}
            variants={slideIn}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ scale: 1.05 }}
          >
            <Card className={`relative overflow-hidden registration-card`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="ticket-tag">
                    {event.type}
                  </Badge>
                  <div className="text-xl font-bold text-gradient">₹{event.price}</div>
                </div>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {/* Add event features/benefits here */}
                </ul>

                <Button
                  onClick={() => addToCart(event)}
                  className={`w-full ${isPassInCart(event.id) ? 'bg-secondary' : ''}`}
                  disabled={!userVerified || isPassInCart(event.id) || showAttendanceWarning}
                >
                  {isPassInCart(event.id) ? (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      In Cart
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </Button>

                {!userVerified && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Please verify your email to register
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}