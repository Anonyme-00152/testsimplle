import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import Warning from "./pages/Warning";
import Chat from "./pages/Chat";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Warning} />
      <Route path={"/chat"} component={Chat} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
