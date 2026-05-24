import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertMessage,
  InsertProject,
  InsertReview,
  InsertUser,
  InsertVisitorLog,
  messages,
  projects,
  reviews,
  siteSettings,
  users,
  visitorLogs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const fields = ["name", "email", "loginMethod", "discordId", "discordUsername", "discordAvatar"] as const;
  for (const field of fields) {
    const val = user[field as keyof InsertUser];
    if (val !== undefined) {
      (values as Record<string, unknown>)[field] = val ?? null;
      updateSet[field] = val ?? null;
    }
  }

  const signedIn = user.lastSignedIn ?? new Date();
  values.lastSignedIn = signedIn;
  updateSet.lastSignedIn = signedIn;

  // Auto-promote owner to admin
  if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  } else if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(visibleOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(projects);
  if (visibleOnly) {
    return query.where(eq(projects.visible, true)).orderBy(projects.order);
  }
  return query.orderBy(projects.order);
}

export async function upsertProject(data: InsertProject & { id?: number }) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, data.id));
  } else {
    await db.insert(projects).values(data);
  }
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(projects).where(eq(projects.id, id));
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) return;
  await db.insert(messages).values(data);
}

export async function getMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function markMessageRead(id: number, isRead: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(messages).set({ isRead }).where(eq(messages.id, id));
}

export async function deleteMessage(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(messages).where(eq(messages.id, id));
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) return;
  await db.insert(reviews).values(data);
}

export async function getReviews(approvedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const q = db.select({
    id: reviews.id,
    userId: reviews.userId,
    rating: reviews.rating,
    body: reviews.body,
    approved: reviews.approved,
    createdAt: reviews.createdAt,
    userName: users.name,
    userDiscordUsername: users.discordUsername,
    userAvatar: users.discordAvatar,
  }).from(reviews).leftJoin(users, eq(reviews.userId, users.id));
  if (approvedOnly) return q.where(eq(reviews.approved, true)).orderBy(desc(reviews.createdAt));
  return q.orderBy(desc(reviews.createdAt));
}

export async function updateReviewApproval(id: number, approved: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(reviews).set({ approved }).where(eq(reviews.id, id));
}

export async function deleteReview(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(reviews).where(eq(reviews.id, id));
}

export async function getUserReview(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reviews).where(eq(reviews.userId, userId)).limit(1);
  return result[0];
}

// ─── Visitor Logs ─────────────────────────────────────────────────────────────

export async function getTotalVisitorCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(visitorLogs);
  return Number(result[0]?.count ?? 0);
}

export async function recordVisit(data: InsertVisitorLog) {
  const db = await getDb();
  if (!db) return data.visitNumber;
  await db.insert(visitorLogs).values(data);
  return data.visitNumber;
}

export async function getVisitorStats() {
  const db = await getDb();
  if (!db) return { total: 0, loggedIn: 0, guests: 0 };
  const total = await db.select({ count: sql<number>`COUNT(*)` }).from(visitorLogs);
  const loggedIn = await db.select({ count: sql<number>`COUNT(*)` }).from(visitorLogs).where(sql`userId IS NOT NULL`);
  return {
    total: Number(total[0]?.count ?? 0),
    loggedIn: Number(loggedIn[0]?.count ?? 0),
    guests: Number(total[0]?.count ?? 0) - Number(loggedIn[0]?.count ?? 0),
  };
}

export async function getRecentVisitors(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitorLogs).orderBy(desc(visitorLogs.createdAt)).limit(limit);
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(siteSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}
