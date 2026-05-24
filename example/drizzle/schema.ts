import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  float,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Discord-specific fields
  discordId: varchar("discordId", { length: 64 }),
  discordUsername: varchar("discordUsername", { length: 128 }),
  discordAvatar: text("discordAvatar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Projects / Services showcase cards
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }).default("code"),
  tags: text("tags"), // JSON array stored as string
  order: int("order").default(0),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Contact messages from visitors
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderName: varchar("senderName", { length: 255 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  body: text("body").notNull(),
  userId: int("userId"), // null if not logged in
  ipAddress: varchar("ipAddress", { length: 64 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Server reviews
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5
  body: text("body").notNull(),
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Visitor logs
export const visitorLogs = mysqlTable("visitor_logs", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId"), // null if not logged in
  ipAddress: varchar("ipAddress", { length: 64 }),
  userAgent: text("userAgent"),
  page: varchar("page", { length: 255 }).default("/"),
  visitNumber: int("visitNumber").notNull(), // the Nth visitor
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisitorLog = typeof visitorLogs.$inferSelect;
export type InsertVisitorLog = typeof visitorLogs.$inferInsert;

// Site settings (key-value store for admin-editable values)
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;
