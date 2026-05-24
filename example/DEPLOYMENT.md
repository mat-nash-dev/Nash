# Nash Portfolio — Deployment & Setup Guide

This guide is written for someone with **zero coding experience**. Follow each step carefully.

---

## Option 1: Deploy with Manus (Recommended — Easiest)

Since this site is already built on the Manus platform, deploying it is as simple as clicking one button.

**Steps:**
1. In the Manus interface, look for the **Publish** button in the top-right corner of the Management UI.
2. Click **Publish** — your site will go live at a free subdomain like `nash-portfolio.manus.space`.
3. You can also connect a **custom domain** (e.g. `nash.dev`) from the Settings → Domains panel.

That's it. The backend, database, and authentication are all handled automatically by Manus.

---

## Making Yourself Admin

Your account will automatically become admin when you first sign in, because the system is configured to recognise the site owner's account. If for any reason it doesn't:

1. Open the **Database** panel in the Manus Management UI.
2. Find your user row in the `users` table.
3. Change the `role` column from `user` to `admin`.
4. Save and refresh the site.

---

## Setting Your Discord Server Invite Link

1. Go to your Discord server → right-click the server name → **Invite People**.
2. Copy the invite link (e.g. `https://discord.gg/yourcode`).
3. Sign in to your portfolio site as admin.
4. Navigate to `/admin` → click **Settings** tab.
5. Paste your invite link into the **Discord Invite Link** field and click Save.

---

## Updating Your Projects

1. Sign in as admin and go to `/admin`.
2. Click the **Projects** tab.
3. Use the **Edit** (pencil) button to change any project card's title, description, icon, or tags.
4. Use **Add Project** to add new services.
5. Use the **eye** toggle to hide/show a project without deleting it.

---

## Viewing Messages from Clients

1. Go to `/admin` → **Messages** tab.
2. All contact form submissions appear here with the sender's name, email, and message.
3. Click the eye icon to mark a message as read/unread.
4. You'll also receive a Manus notification whenever a new message arrives.

---

## Authentication Providers

The site uses **Manus OAuth**, which supports:
- **Discord** — users sign in with their Discord account
- **Google** — users sign in with their Google account
- **Email** — users sign in with their email address

No additional configuration is needed. The Manus login portal handles provider selection automatically.

---

## Environment Variables (Already Configured)

All required environment variables are automatically injected by the Manus platform:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MySQL database connection |
| `JWT_SECRET` | Session cookie signing |
| `VITE_APP_ID` | OAuth application ID |
| `OAUTH_SERVER_URL` | Manus OAuth backend |
| `OWNER_OPEN_ID` | Your account ID (auto-promotes to admin) |
| `BUILT_IN_FORGE_API_KEY` | Manus built-in API access |

You do **not** need to set any of these manually.

---

## Option 2: GitHub Pages (Frontend Only)

> **Note:** GitHub Pages only hosts static files. Since this site has a backend (database, auth, API), you would need a separate backend host. This is significantly more complex. **Manus deployment (Option 1) is strongly recommended.**

If you still want GitHub Pages:

### Frontend (GitHub Pages)
1. Export the project code from Manus → Settings → GitHub (or download as ZIP).
2. Create a GitHub account at [github.com](https://github.com) if you don't have one.
3. Create a new repository named `nash-portfolio`.
4. Upload the `client/` folder contents to the repository.
5. Go to repository Settings → Pages → set source to the `main` branch.
6. Your frontend will be live at `https://yourusername.github.io/nash-portfolio`.

### Backend (Railway or Render)
1. Create an account at [railway.app](https://railway.app) (free tier available).
2. Connect your GitHub repository.
3. Set the following environment variables in Railway's dashboard (copy from your Manus project):
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `VITE_APP_ID`
   - `OAUTH_SERVER_URL`
   - `OWNER_OPEN_ID`
4. Set the build command to `pnpm build` and start command to `node dist/index.js`.
5. Update the OAuth callback URL in Manus to point to your Railway backend URL.

**This is complex — again, Manus deployment is recommended.**

---

## Getting More Visitors (Reaching Your 50-View Goal)

Here are practical suggestions to reach 50 views in your first week:

1. **Share on Discord** — Post your portfolio link in Discord servers related to development, gaming, and Minecraft communities.
2. **Reddit** — Share in r/discordapp, r/webdev, r/Minecraft with a post like "I built a free Discord bot service — check out my portfolio".
3. **Twitter/X** — Post about your free services with your portfolio link.
4. **Direct outreach** — Message server owners on Discord who might need bots or server design help.
5. **Discord server** — Invite people to your Discord server from your portfolio, and share the portfolio link there.

---

## Support

If you run into any issues, use the **Contact** page on your own site or reach out through your Discord server.

Made and Developed by Nash ©
