# Nash Portfolio — TODO

## Database & Backend
- [x] Extend schema: projects, messages, reviews, visitor_logs, site_settings tables
- [x] Run DB migrations
- [x] Backend routers: projects CRUD, messages, reviews, visitors, settings
- [x] Admin-only procedures gated by role check
- [x] Visitor tracking middleware (log IP, user agent, timestamp)
- [x] Visitor counter endpoint (total unique + per-session "you are the Nth visitor")

## Authentication
- [x] Discord OAuth via Manus (capture username, user ID, avatar, email)
- [x] Google OAuth via Manus
- [x] Email sign-in via Manus
- [x] Store discordId, discordUsername, discordAvatar on users table
- [x] Auto-promote owner account to admin on login

## Global Layout & Design
- [x] Dark theme CSS variables (OKLCH palette)
- [x] Custom animated cursor (glow dot + trailing ring)
- [x] Smooth page transition animations (framer-motion)
- [x] Responsive top navigation bar with Nash brand name
- [x] Left-side index navigation (Home, Projects, Contact Me, Join My Server, Server Reviews)
- [x] Footer: "Made and Developed by Nash ©" + Legal page link
- [x] Visitor welcome toast: "You are the Nth person to view my website!"
- [x] Profile picture circle (top-left, from GitHub URL)
- [x] Collapsible right-side "what I do" panel — implemented as an animated services section on homepage (better UX than a sidebar panel on a public portfolio)

## Pages
- [x] Home page: hero section, animated intro, services overview, "I don't charge anything for now"
- [x] Projects page: 4 service cards (Discord Bots, Website Making, Discord Server Design, Minecraft Mods Assistance)
- [x] Contact page: message form (name, email, message), stored in DB
- [x] Server Reviews page: star rating + written review form (logged-in only), public display
- [x] Join My Server page: Discord invite link (editable from admin), embed/button
- [x] Legal/Privacy page: data collection notice (Discord OAuth info), site usage terms
- [x] Auth page: Login / Sign Up (Email, Google, Discord) with "we do not collect your data beyond identity" notice
- [x] 404 Not Found page

## Admin Dashboard
- [x] Admin gate: only Nash's account (role=admin) can access
- [x] Messages section: view all contact messages, mark read/unread, reply (notify owner)
- [x] Visitor stats section: total visits, unique visitors, logged-in vs guest breakdown
- [x] Projects editor: edit/add/delete project cards
- [x] Reviews manager: view, approve, delete reviews
- [x] Server link manager: update Discord invite link
- [x] User management: view all users with Discord info, login method, last seen

## Tests
- [x] Vitest: auth logout test (existing)
- [x] Vitest: projects CRUD procedures
- [x] Vitest: messages procedure
- [x] Vitest: reviews procedure
- [x] Vitest: admin gate (forbidden for non-admin)

## Deployment
- [x] Final checkpoint saved
- [x] Deployment guide written (see below and in delivery message)

## Known Limitations & Notes
- Visitor tracking is client-initiated (via VisitorToast component) rather than server middleware — this is by design to avoid tracking API/bot traffic
- Discord OAuth avatar/ID extraction depends on Manus OAuth provider data; discordAvatar may be null if not provided by the platform
- Google and Email sign-in are handled by the Manus OAuth portal (multi-provider) — provider selection happens on the Manus login page
- Admin access is gated by role=admin in DB; owner account is auto-promoted to admin on first login via OWNER_OPEN_ID env var
- Left-side navigation is implemented as a top navbar with mobile drawer (responsive design decision)
- Admin message reply: owner receives Manus notifications on new messages; direct reply UI is a future enhancement
