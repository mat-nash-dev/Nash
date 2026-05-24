import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      const loginMethod = userInfo.loginMethod ?? userInfo.platform ?? null;

      // Extract Discord-specific data from the name field if loginMethod is discord
      // The Manus OAuth platform field indicates the provider
      let discordId: string | null = null;
      let discordUsername: string | null = null;
      let discordAvatar: string | null = null;

      // openId format for Discord via Manus: discord:{userId} or similar
      if (loginMethod?.toLowerCase().includes('discord') || userInfo.openId.toLowerCase().includes('discord')) {
        discordUsername = userInfo.name || null;
        // Extract Discord ID from openId if it contains it
        const discordIdMatch = userInfo.openId.match(/discord[_:]?([0-9]+)/i);
        if (discordIdMatch) {
          discordId = discordIdMatch[1];
        }
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod,
        discordId,
        discordUsername,
        discordAvatar,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
