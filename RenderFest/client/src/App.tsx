import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SplashLoader } from "@/components/layout/SplashLoader";
import { PageTransition } from "@/components/layout/PageTransition";
import Home from "@/pages/index";
import Events from "@/pages/events";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Teams from "@/pages/teams";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/events" component={Events} />
        <Route path="/events/:id" component={Events} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/teams" component={Teams} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash ? (
        <SplashLoader onFinish={() => setShowSplash(false)} />
      ) : (
        <Router />
      )}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;