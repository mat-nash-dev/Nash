import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createMessage,
  createReview,
  deleteMessage,
  deleteProject,
  deleteReview,
  getAllSettings,
  getAllUsers,
  getMessages,
  getProjects,
  getRecentVisitors,
  getReviews,
  getSetting,
  getTotalVisitorCount,
  getUserReview,
  getVisitorStats,
  markMessageRead,
  recordVisit,
  setSetting,
  updateReviewApproval,
  upsertProject,
} from "./db";
import { nanoid } from "nanoid";
import { notifyOwner } from "./_core/notification";

// Admin gate middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Projects ───────────────────────────────────────────────────────────────
  projects: router({
    list: publicProcedure.query(() => getProjects(true)),
    listAll: adminProcedure.query(() => getProjects(false)),
    upsert: adminProcedure
      .input(
        z.object({
          id: z.number().optional(),
          title: z.string().min(1),
          description: z.string().optional(),
          icon: z.string().optional(),
          tags: z.string().optional(),
          order: z.number().optional(),
          visible: z.boolean().optional(),
        })
      )
      .mutation(({ input }) => upsertProject(input)),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteProject(input.id)),
  }),

  // ─── Messages ───────────────────────────────────────────────────────────────
  messages: router({
    send: publicProcedure
      .input(
        z.object({
          senderName: z.string().min(1),
          senderEmail: z.string().email(),
          subject: z.string().optional(),
          body: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ip =
          (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          (ctx.req as any).socket?.remoteAddress ||
          null;
        await createMessage({
          ...input,
          userId: ctx.user?.id ?? null,
          ipAddress: ip,
        });
        // Notify owner
        await notifyOwner({
          title: `New message from ${input.senderName}`,
          content: `Subject: ${input.subject ?? "No subject"}\n\n${input.body}`,
        });
        return { success: true };
      }),
    list: adminProcedure.query(() => getMessages()),
    markRead: adminProcedure
      .input(z.object({ id: z.number(), isRead: z.boolean() }))
      .mutation(({ input }) => markMessageRead(input.id, input.isRead)),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteMessage(input.id)),
  }),

  // ─── Reviews ────────────────────────────────────────────────────────────────
  reviews: router({
    list: publicProcedure.query(() => getReviews(true)),
    listAll: adminProcedure.query(() => getReviews(false)),
    myReview: protectedProcedure.query(({ ctx }) => getUserReview(ctx.user.id)),
    submit: protectedProcedure
      .input(
        z.object({
          rating: z.number().min(1).max(5),
          body: z.string().min(10).max(1000),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const existing = await getUserReview(ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "You have already submitted a review." });
        }
        await createReview({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
    approve: adminProcedure
      .input(z.object({ id: z.number(), approved: z.boolean() }))
      .mutation(({ input }) => updateReviewApproval(input.id, input.approved)),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteReview(input.id)),
  }),

  // ─── Visitors ───────────────────────────────────────────────────────────────
  visitors: router({
    track: publicProcedure
      .input(z.object({ sessionId: z.string(), page: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const total = await getTotalVisitorCount();
        const visitNumber = total + 1;
        const ip =
          (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          (ctx.req as any).socket?.remoteAddress ||
          null;
        await recordVisit({
          sessionId: input.sessionId,
          userId: ctx.user?.id ?? null,
          ipAddress: ip,
          userAgent: ctx.req.headers["user-agent"] ?? null,
          page: input.page ?? "/",
          visitNumber,
        });
        return { visitNumber };
      }),
    stats: adminProcedure.query(() => getVisitorStats()),
    recent: adminProcedure.query(() => getRecentVisitors(100)),
  }),

  // ─── Settings ───────────────────────────────────────────────────────────────
  settings: router({
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => getSetting(input.key)),
    set: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(({ input }) => setSetting(input.key, input.value)),
    all: adminProcedure.query(() => getAllSettings()),
  }),

  // ─── Admin: Users ───────────────────────────────────────────────────────────
  admin: router({
    users: adminProcedure.query(() => getAllUsers()),
  }),
});

export type AppRouter = typeof appRouter;
