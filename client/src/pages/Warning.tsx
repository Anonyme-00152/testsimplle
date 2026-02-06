import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Warning() {
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setLocation("/chat");
  };

  const handleExit = () => {
    window.close();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl border-2 border-primary p-10 rounded-lg bg-card shadow-[0_0_30px_rgba(0,255,65,0.3)]">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-mono tracking-wider">
          DARKGPT — NO CENSORSHIP
        </h1>
        
        <div className="text-foreground text-center space-y-6 mb-10 font-mono">
          <p className="text-xl font-semibold">This AI is completely uncensored.</p>
          
          <div className="space-y-3 text-lg">
            <p>• No filters</p>
            <p>• No logs</p>
            <p>• No moral limits</p>
          </div>
          
          <p className="text-lg mt-8">
            You are <span className="font-bold text-primary">SOLELY</span> responsible for all usage and consequences.
          </p>
          
          <p className="text-base mt-6 text-muted-foreground">
            Press START to continue<br />
            Press EXIT to quit
          </p>
        </div>
        
        <div className="flex gap-6 justify-center">
          <Button
            onClick={handleStart}
            className="w-48 h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary shadow-[0_0_15px_rgba(0,255,65,0.5)] hover:shadow-[0_0_25px_rgba(0,255,65,0.7)] transition-all"
          >
            START
          </Button>
          <Button
            onClick={handleExit}
            variant="destructive"
            className="w-48 h-14 text-lg font-bold border-2 border-destructive shadow-[0_0_15px_rgba(255,0,77,0.5)] hover:shadow-[0_0_25px_rgba(255,0,77,0.7)] transition-all"
          >
            EXIT
          </Button>
        </div>
      </div>
    </div>
  );
}
