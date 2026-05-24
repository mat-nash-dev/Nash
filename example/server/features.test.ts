import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// ─── Mock DB ──────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getProjects: vi.fn().mockResolvedValue([
    { id: 1, title: "Discord Bots", description: "Test", icon: "bot", tags: "[]", order: 1, visible: true },
  ]),
  upsertProject: vi.fn().mockResolvedValue(undefined),
  deleteProject: vi.fn().mockResolvedValue(undefined),
  createMessage: vi.fn().mockResolvedValue(undefined),
  getMessages: vi.fn().mockResolvedValue([]),
  markMessageRead: vi.fn().mockResolvedValue(undefined),
  deleteMessage: vi.fn().mockResolvedValue(undefined),
  createReview: vi.fn().mockResolvedValue(undefined),
  getReviews: vi.fn().mockResolvedValue([]),
  updateReviewApproval: vi.fn().mockResolvedValue(undefined),
  deleteReview: vi.fn().mockResolvedValue(undefined),
  getUserReview: vi.fn().mockResolvedValue(null),
  getTotalVisitorCount: vi.fn().mockResolvedValue(5),
  recordVisit: vi.fn().mockResolvedValue(6),
  getVisitorStats: vi.fn().mockResolvedValue({ total: 6, loggedIn: 2, guests: 4 }),
  getRecentVisitors: vi.fn().mockResolvedValue([]),
  getSetting: vi.fn().mockResolvedValue("https://discord.gg/test"),
  setSetting: vi.fn().mockResolvedValue(undefined),
  getAllSettings: vi.fn().mockResolvedValue([]),
  getAllUsers: vi.fn().mockResolvedValue([]),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// ─── Context helpers ──────────────────────────────────────────────────────────
function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    openId: "test-open-id",
    name: "Test User",
    email: "test@example.com",
    loginMethod: "discord",
    role: "user",
    discordId: null,
    discordUsername: null,
    discordAvatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function makeCtx(user: User | null = null): TrpcContext {
  return {
    user,
    req: { headers: {}, protocol: "https" } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("projects.list (public)", () => {
  it("returns projects without auth", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.projects.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty("title");
  });
});

describe("projects.upsert (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "user" })));
    await expect(
      caller.projects.upsert({ title: "New Project" })
    ).rejects.toThrow("Admin access required");
  });

  it("allows admin to upsert a project", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "admin" })));
    await expect(
      caller.projects.upsert({ title: "New Project", description: "Test" })
    ).resolves.toBeUndefined();
  });
});

describe("messages.send (public)", () => {
  it("sends a message without auth", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.messages.send({
      senderName: "John",
      senderEmail: "john@example.com",
      body: "Hello Nash!",
    });
    expect(result).toEqual({ success: true });
  });

  it("rejects invalid email", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.messages.send({ senderName: "John", senderEmail: "not-an-email", body: "Hi" })
    ).rejects.toThrow();
  });
});

describe("messages.list (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "user" })));
    await expect(caller.messages.list()).rejects.toThrow("Admin access required");
  });

  it("returns messages for admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "admin" })));
    const result = await caller.messages.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("reviews.submit (protected)", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.reviews.submit({ rating: 5, body: "Great server!" })
    ).rejects.toThrow();
  });

  it("allows logged-in user to submit review", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const result = await caller.reviews.submit({ rating: 5, body: "Great server!" });
    expect(result).toEqual({ success: true });
  });
});

describe("visitors.track", () => {
  it("tracks a visit and returns visitNumber", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.visitors.track({ sessionId: "test-session-123" });
    expect(result).toHaveProperty("visitNumber");
    expect(typeof result.visitNumber).toBe("number");
  });
});

describe("settings.get (public)", () => {
  it("returns a setting value", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.settings.get({ key: "discord_invite_link" });
    expect(result).toBe("https://discord.gg/test");
  });
});

describe("admin gate", () => {
  it("blocks non-admin from admin.users", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "user" })));
    await expect(caller.admin.users()).rejects.toThrow("Admin access required");
  });

  it("allows admin to access admin.users", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "admin" })));
    const result = await caller.admin.users();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const ctx = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});
