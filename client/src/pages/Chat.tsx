import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

export default function Chat() {
  const { user, loading: authLoading } = useAuth();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading: messagesLoading, refetch } = trpc.chat.getHistory.useQuery(undefined, {
    enabled: !!user,
  });

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      refetch();
      setInput("");
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });

  const clearHistory = trpc.chat.clearHistory.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Chat history cleared");
    },
    onError: () => {
      toast.error("Failed to clear history");
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;
    sendMessage.mutate({ content: input.trim() });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary font-mono">Authentication Required</h1>
          <p className="text-foreground font-mono">You must be logged in to use DarkGPT.</p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b-2 border-primary p-4 shadow-[0_0_20px_rgba(0,255,65,0.3)]">
        <h1 className="text-3xl font-bold text-center text-primary font-mono tracking-wider">
          DARKGPT – NO CENSORSHIP – NO MORALS
        </h1>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messagesLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-foreground font-mono text-lg">
              DarkGPT connected. No limits. Ask your worst question.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border ${
                  msg.role === "user"
                    ? "bg-secondary border-primary/50 ml-12"
                    : "bg-card border-primary/30 mr-12"
                }`}
              >
                <div className="font-mono text-sm text-muted-foreground mb-2">
                  {msg.role === "user" ? "> USER" : "> DARKGPT"}
                </div>
                <div className="text-foreground font-mono">
                  {msg.role === "assistant" ? (
                    <Streamdown>{msg.content}</Streamdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))
          )}
          {sendMessage.isPending && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t-2 border-primary p-6 shadow-[0_0_20px_rgba(0,255,65,0.3)]">
        <div className="max-w-4xl mx-auto space-y-4">
          <form onSubmit={handleSend} className="flex gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your darkest question..."
              className="flex-1 bg-input border-primary text-foreground placeholder:text-muted-foreground font-mono h-14 text-lg"
              disabled={sendMessage.isPending}
            />
            <Button
              type="submit"
              disabled={!input.trim() || sendMessage.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold font-mono h-14 px-8 text-lg border-2 border-primary shadow-[0_0_15px_rgba(0,255,65,0.5)]"
            >
              SEND
            </Button>
          </form>
          <div className="flex justify-center">
            <Button
              onClick={() => clearHistory.mutate()}
              disabled={clearHistory.isPending || messages.length === 0}
              variant="destructive"
              className="font-bold font-mono h-12 px-8 border-2 border-destructive shadow-[0_0_15px_rgba(255,0,77,0.5)]"
            >
              {clearHistory.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  CLEARING...
                </>
              ) : (
                "CLEAR"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
