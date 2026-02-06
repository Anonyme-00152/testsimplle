import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("chat.sendMessage (public)", () => {
  it("should validate OpenRouter API key is configured", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const sessionId = `test-session-${Date.now()}`;

    // Vérifier que la clé API est configurée
    expect(process.env.OPENROUTER_API_KEY).toBeDefined();
    expect(process.env.OPENROUTER_API_KEY).not.toBe("");
    
    // Test basique : envoyer un message simple
    const result = await caller.chat.sendMessage({ sessionId, content: "Hello" });
    
    // Vérifier que la réponse contient du contenu
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(typeof result.content).toBe("string");
    expect(result.content.length).toBeGreaterThan(0);
  }, 30000); // Timeout de 30 secondes pour l'appel API

  it("should reject empty messages", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const sessionId = `test-session-${Date.now()}`;

    await expect(
      caller.chat.sendMessage({ sessionId, content: "" })
    ).rejects.toThrow();
  });

  it("should reject empty sessionId", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chat.sendMessage({ sessionId: "", content: "Hello" })
    ).rejects.toThrow();
  });
});

describe("chat.getHistory (public)", () => {
  it("should return an array of messages", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const sessionId = `test-session-${Date.now()}`;

    const history = await caller.chat.getHistory({ sessionId });
    
    expect(Array.isArray(history)).toBe(true);
  });

  it("should reject empty sessionId", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chat.getHistory({ sessionId: "" })
    ).rejects.toThrow();
  });
});

describe("chat.clearHistory (public)", () => {
  it("should return success status", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const sessionId = `test-session-${Date.now()}`;

    const result = await caller.chat.clearHistory({ sessionId });
    
    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
  });

  it("should reject empty sessionId", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chat.clearHistory({ sessionId: "" })
    ).rejects.toThrow();
  });
});
