import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield, MessageSquare, Users, FolderOpen, Star, Settings,
  Eye, EyeOff, Trash2, Check, X, Edit2, Plus, Save, LogIn,
  BarChart3, Globe, Bot, Server, Gamepad2, Code2, Zap,
} from "lucide-react";

const ICON_OPTIONS = ["bot", "globe", "server", "gamepad", "code", "zap"];
const ICON_MAP: Record<string, React.ElementType> = {
  bot: Bot, globe: Globe, server: Server, gamepad: Gamepad2, code: Code2, zap: Zap,
};

type Tab = "overview" | "messages" | "reviews" | "projects" | "users" | "settings";

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <div className="glass glow-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const utils = trpc.useUtils();

  // Data queries
  const { data: messages = [] } = trpc.messages.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: reviews = [] } = trpc.reviews.listAll.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: projects = [] } = trpc.projects.listAll.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: visitorStats } = trpc.visitors.stats.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: users = [] } = trpc.admin.users.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: settings = [] } = trpc.settings.all.useQuery(undefined, { enabled: user?.role === "admin" });

  // Mutations
  const markReadMutation = trpc.messages.markRead.useMutation({ onSuccess: () => utils.messages.list.invalidate() });
  const deleteMessageMutation = trpc.messages.delete.useMutation({ onSuccess: () => { utils.messages.list.invalidate(); toast.success("Message deleted"); } });
  const approveReviewMutation = trpc.reviews.approve.useMutation({ onSuccess: () => utils.reviews.listAll.invalidate() });
  const deleteReviewMutation = trpc.reviews.delete.useMutation({ onSuccess: () => { utils.reviews.listAll.invalidate(); toast.success("Review deleted"); } });
  const deleteProjectMutation = trpc.projects.delete.useMutation({ onSuccess: () => { utils.projects.listAll.invalidate(); toast.success("Project deleted"); } });
  const upsertProjectMutation = trpc.projects.upsert.useMutation({ onSuccess: () => { utils.projects.listAll.invalidate(); setEditingProject(null); toast.success("Project saved!"); } });
  const setSettingMutation = trpc.settings.set.useMutation({ onSuccess: () => { utils.settings.all.invalidate(); toast.success("Setting saved!"); } });

  // Project editing state
  const [editingProject, setEditingProject] = useState<any>(null);
  const [discordLink, setDiscordLink] = useState("");

  if (loading) {
    return (
      <PageWrapper>
        <div className="container py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <div className="container py-20 flex items-center justify-center">
          <div className="glass glow-border rounded-2xl p-10 text-center max-w-sm">
            <LogIn className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground text-sm mb-4">You must be signed in to access the admin dashboard.</p>
            <Button onClick={() => (window.location.href = getLoginUrl("/admin"))} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
              Sign In
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (user?.role !== "admin") {
    return (
      <PageWrapper>
        <div className="container py-20 flex items-center justify-center">
          <div className="glass glow-border rounded-2xl p-10 text-center max-w-sm">
            <Shield className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-sm">This area is restricted to Nash's account only.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare, count: messages.filter((m: any) => !m.isRead).length || undefined },
    { id: "reviews", label: "Reviews", icon: Star, count: reviews.length || undefined },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const discordInviteSetting = settings.find((s: any) => s.key === "discord_invite_link");

  return (
    <PageWrapper>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 10%, oklch(0.65 0.22 290 / 0.05) 0%, transparent 70%)" }} />

      <div className="container py-8 relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back, <span className="text-primary font-medium">{user.name}</span></p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count !== undefined && count > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Visitors" value={visitorStats?.total ?? 0} sub="All time" />
              <StatCard icon={Shield} label="Logged In" value={visitorStats?.loggedIn ?? 0} sub="Authenticated" />
              <StatCard icon={Eye} label="Guests" value={visitorStats?.guests ?? 0} sub="Anonymous" />
              <StatCard icon={MessageSquare} label="Messages" value={messages.length} sub={`${messages.filter((m: any) => !m.isRead).length} unread`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={Star} label="Reviews" value={reviews.length} sub="Total submitted" />
              <StatCard icon={FolderOpen} label="Projects" value={projects.length} sub="Active services" />
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {activeTab === "messages" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Incoming Messages</h2>
              <Badge variant="secondary">{messages.length} total</Badge>
            </div>
            {messages.length === 0 ? (
              <div className="glass rounded-xl p-10 text-center text-muted-foreground">No messages yet.</div>
            ) : (
              messages.map((msg: any) => (
                <div key={msg.id} className={`glass glow-border rounded-xl p-5 ${!msg.isRead ? "border-primary/30" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.senderName}</span>
                        <span className="text-muted-foreground text-xs">{msg.senderEmail}</span>
                        {!msg.isRead && <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">New</Badge>}
                      </div>
                      {msg.subject && <p className="text-sm font-medium mb-1">{msg.subject}</p>}
                      <p className="text-muted-foreground text-sm leading-relaxed">{msg.body}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                        {msg.ipAddress && <span>IP: {msg.ipAddress}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => markReadMutation.mutate({ id: msg.id, isRead: !msg.isRead })} className="h-8 w-8 p-0">
                        {msg.isRead ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteMessageMutation.mutate({ id: msg.id })} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">All Reviews</h2>
              <Badge variant="secondary">{reviews.length} total</Badge>
            </div>
            {reviews.length === 0 ? (
              <div className="glass rounded-xl p-10 text-center text-muted-foreground">No reviews yet.</div>
            ) : (
              reviews.map((review: any) => (
                <div key={review.id} className="glass glow-border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.userAvatar ?? undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {(review.userDiscordUsername || review.userName || "?")[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{review.userDiscordUsername || review.userName || "Anonymous"}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "star-filled fill-current" : "star-empty"}`} />
                            ))}
                          </div>
                          {!review.approved && <Badge variant="destructive" className="text-xs">Hidden</Badge>}
                        </div>
                        <p className="text-muted-foreground text-sm">{review.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(review.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => approveReviewMutation.mutate({ id: review.id, approved: !review.approved })} className="h-8 w-8 p-0">
                        {review.approved ? <EyeOff className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 text-green-500" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteReviewMutation.mutate({ id: review.id })} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Manage Projects</h2>
              <Button size="sm" onClick={() => setEditingProject({ title: "", description: "", icon: "code", tags: "[]", order: 0, visible: true })} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-1.5" /> Add Project
              </Button>
            </div>

            {/* Edit form */}
            {editingProject && (
              <div className="glass glow-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold">{editingProject.id ? "Edit Project" : "New Project"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="bg-input/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Icon</Label>
                    <div className="flex gap-2">
                      {ICON_OPTIONS.map(ic => {
                        const Ic = ICON_MAP[ic] ?? Code2;
                        return (
                          <button key={ic} type="button" onClick={() => setEditingProject({ ...editingProject, icon: ic })}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${editingProject.icon === ic ? "bg-primary/30 text-primary" : "bg-accent text-muted-foreground hover:bg-primary/15"}`}>
                            <Ic className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={editingProject.description ?? ""} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} rows={3} className="bg-input/50 resize-none" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tags (JSON array, e.g. ["Discord","Bots"])</Label>
                  <Input value={editingProject.tags ?? "[]"} onChange={e => setEditingProject({ ...editingProject, tags: e.target.value })} className="bg-input/50 font-mono text-xs" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs">Order</Label>
                    <Input type="number" value={editingProject.order ?? 0} onChange={e => setEditingProject({ ...editingProject, order: Number(e.target.value) })} className="bg-input/50" />
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" id="visible" checked={editingProject.visible ?? true} onChange={e => setEditingProject({ ...editingProject, visible: e.target.checked })} className="w-4 h-4 accent-primary" />
                    <Label htmlFor="visible" className="text-xs">Visible</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => upsertProjectMutation.mutate(editingProject)} disabled={upsertProjectMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Save className="w-4 h-4 mr-1.5" /> Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                </div>
              </div>
            )}

            {projects.map((project: any) => {
              const Icon = ICON_MAP[project.icon] ?? Code2;
              return (
                <div key={project.id} className="glass glow-border rounded-xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{project.title}</span>
                      {!project.visible && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                    </div>
                    <p className="text-muted-foreground text-xs truncate">{project.description}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setEditingProject(project)} className="h-8 w-8 p-0">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteProjectMutation.mutate({ id: project.id })} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Registered Users</h2>
              <Badge variant="secondary">{users.length} total</Badge>
            </div>
            {users.map((u: any) => (
              <div key={u.id} className="glass glow-border rounded-xl p-4 flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={u.discordAvatar ?? undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">{u.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{u.name ?? "Unknown"}</span>
                    {u.role === "admin" && <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">Admin</Badge>}
                    {u.loginMethod && <Badge variant="secondary" className="text-xs">{u.loginMethod}</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                    {u.email && <span>{u.email}</span>}
                    {u.discordUsername && <span>@{u.discordUsername}</span>}
                    {u.discordId && <span>Discord ID: {u.discordId}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Joined: {new Date(u.createdAt).toLocaleDateString()} · Last seen: {new Date(u.lastSignedIn).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl">
            <h2 className="font-bold">Site Settings</h2>

            {/* Discord invite link */}
            <div className="glass glow-border rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Discord Invite Link</h3>
              </div>
              <p className="text-muted-foreground text-sm">Update the Discord server invite link shown on the Join My Server page.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://discord.gg/..."
                  defaultValue={discordInviteSetting?.value ?? ""}
                  onChange={e => setDiscordLink(e.target.value)}
                  className="bg-input/50"
                />
                <Button
                  onClick={() => setSettingMutation.mutate({ key: "discord_invite_link", value: discordLink || discordInviteSetting?.value || "" })}
                  disabled={setSettingMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* All settings list */}
            <div className="glass glow-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">All Settings</h3>
              <div className="space-y-3">
                {settings.map((s: any) => (
                  <div key={s.key} className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm font-mono text-muted-foreground">{s.key}</span>
                    <span className="text-sm truncate max-w-48">{s.value ?? "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
