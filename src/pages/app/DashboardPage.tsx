import { LayoutDashboard, Mic, CheckSquare, Bot, TrendingUp, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Meetings This Week", value: "24", change: "+12%", icon: Mic },
  { label: "Actions Created", value: "87", change: "+8%", icon: CheckSquare },
  { label: "Agents Active", value: "6", change: "0", icon: Bot },
  { label: "Avg Processing", value: "1.2s", change: "-15%", icon: Clock },
];

const recentMeetings = [
  { title: "Sprint Planning Q3", time: "2h ago", actions: 5, confidence: 92 },
  { title: "Design Review — Mobile", time: "4h ago", actions: 3, confidence: 88 },
  { title: "Stakeholder Sync", time: "Yesterday", actions: 7, confidence: 95 },
  { title: "Incident Retro #42", time: "Yesterday", actions: 4, confidence: 79 },
];

const pendingActions = [
  { title: "Draft LinkedIn ad copy", assignee: "Sam", due: "Aug 5", priority: "high" },
  { title: "Update API docs", assignee: "Maya", due: "Aug 7", priority: "medium" },
  { title: "Review model metrics", assignee: "Lena", due: "Aug 6", priority: "low" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your meeting intelligence overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <span className={`text-xs font-medium ${s.change.startsWith("+") ? "text-primary" : s.change.startsWith("-") ? "text-glow-secondary" : "text-muted-foreground"}`}>
                  {s.change}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMeetings.map((m) => (
              <div key={m.title} className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3 transition hover:bg-secondary/50 cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.time} · {m.actions} actions</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${m.confidence >= 90 ? "bg-primary/15 text-primary" : "bg-yellow-500/15 text-yellow-400"}`}>
                    {m.confidence}%
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingActions.map((a) => (
              <div key={a.title} className="rounded-lg bg-secondary/30 px-4 py-3">
                <p className="text-sm font-medium">{a.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground">{a.assignee}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">Due {a.due}</span>
                  <span className={`ml-auto text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                    a.priority === "high" ? "bg-destructive/15 text-destructive" : a.priority === "medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {a.priority}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
