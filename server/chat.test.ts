import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
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

describe("chat.sendMessage", () => {
  it("should validate OpenRouter API key is configured", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Vérifier que la clé API est configurée
    expect(process.env.OPENROUTER_API_KEY).toBeDefined();
    expect(process.env.OPENROUTER_API_KEY).not.toBe("");
    
    // Test basique : envoyer un message simple
    const result = await caller.chat.sendMessage({ content: "Hello" });
    
    // Vérifier que la réponse contient du contenu
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(typeof result.content).toBe("string");
    expect(result.content.length).toBeGreaterThan(0);
  }, 30000); // Timeout de 30 secondes pour l'appel API

  it("should reject empty messages", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chat.sendMessage({ content: "" })
    ).rejects.toThrow();
  });
});

describe("chat.getHistory", () => {
  it("should return an array of messages", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const history = await caller.chat.getHistory();
    
    expect(Array.isArray(history)).toBe(true);
  });
});

describe("chat.clearHistory", () => {
  it("should return success status", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.clearHistory();
    
    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
  });
});
