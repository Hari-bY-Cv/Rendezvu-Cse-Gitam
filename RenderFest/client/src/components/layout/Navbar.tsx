import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Calendar, Users, Award } from "lucide-react";
import { navItemHover } from "@/lib/animations";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Users, label: "Teams", href: "/teams" },
  { icon: Award, label: "Register", href: "/register" }
];

export function Navbar() {
  const isMobile = useIsMobile();
  const [location] = useLocation();

  return (
    <nav
      className={`fixed ${
        isMobile ? "bottom-0 w-full h-16" : "left-0 h-screen w-16"
      } bg-background/80 backdrop-blur-lg border-r z-50`}
    >
      <div
        className={`flex ${
          isMobile ? "flex-row h-full" : "flex-col h-screen pt-8"
        } items-center justify-center gap-8`}
      >
        {navItems.map(({ icon: Icon, label, href }) => (
          <motion.div
            key={href}
            variants={navItemHover}
            initial="initial"
            whileHover="hover"
            className="relative group"
          >
            <Link href={href}>
              <a
                className={`p-2 rounded-lg transition-colors ${
                  location === href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-6 h-6" />
                {!isMobile && (
                  <div className="absolute left-14 px-2 py-1 bg-popover rounded hidden group-hover:block whitespace-nowrap">
                    {label}
                  </div>
                )}
              </a>
            </Link>
          </motion.div>
        ))}
      </div>
    </nav>
  );
}