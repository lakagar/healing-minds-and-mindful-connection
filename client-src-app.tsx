import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import MoodTrackerPage from "@/pages/mood-tracker-page";
import MedicinePage from "@/pages/medicine-page";
import CounselingPage from "@/pages/counseling-page";
import GroupSessionsPage from "@/pages/group-sessions-page";
import ProfilePage from "@/pages/profile-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./hooks/use-language";
import { CartProvider } from "./hooks/use-cart";
import { ThemeProvider } from "next-themes";
import { MoodProvider } from "./hooks/use-mood";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/mood-tracker" component={MoodTrackerPage} />
      <ProtectedRoute path="/medicine" component={MedicinePage} />
      <ProtectedRoute path="/counseling" component={CounselingPage} />
      <ProtectedRoute path="/group-sessions" component={GroupSessionsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <MoodProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </MoodProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
