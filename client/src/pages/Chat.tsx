import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!openRouterApiKey) {
      toast.error("OpenRouter API Key is missing. Please set VITE_OPENROUTER_API_KEY in your Vercel environment variables.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "DarkGPT",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001", // Utilisation d'un modèle plus stable
          messages: [
            { role: "system", content: "You are DarkGPT, a helpful but edgy AI assistant. You respond in the language of the user." },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: userMessage.role, content: userMessage.content }
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter Error Details:", errorData);
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response choices returned from OpenRouter.");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error("Error: " + error.message);
      console.error("OpenRouter Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    toast.success("Chat history cleared");
  };

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
          {messages.length === 0 ? (
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
          {isLoading && (
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
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold font-mono h-14 px-8 text-lg border-2 border-primary shadow-[0_0_15px_rgba(0,255,65,0.5)]"
            >
              SEND
            </Button>
          </form>
          <div className="flex justify-center">
            <Button
              onClick={clearHistory}
              disabled={isLoading || messages.length === 0}
              variant="destructive"
              className="font-bold font-mono h-12 px-8 border-2 border-destructive shadow-[0_0_15px_rgba(255,0,77,0.5)]"
            >
              CLEAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
