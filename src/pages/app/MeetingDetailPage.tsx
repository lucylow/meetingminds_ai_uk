import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Users, Clock, Tag, Paperclip, CheckSquare, AlertTriangle } from "lucide-react";

const transcript = [
  { time: "00:15", speaker: "Alice", text: "Let's kick off the sprint planning. I want to focus on the mobile redesign this sprint." },
  { time: "01:02", speaker: "Bob", text: "Sounds good. I've got the API endpoints ready for the new auth flow." },
  { time: "02:30", speaker: "Alice", text: "Great. Can you create a ticket for the token refresh logic? Mark it high priority." },
  { time: "03:15", speaker: "Carol", text: "I'll handle the UI components. Should have the design system updates by Wednesday." },
  { time: "04:00", speaker: "Bob", text: "One concern — the rate limiter on staging is acting up. We might need to look at that before release." },
  { time: "05:10", speaker: "Alice", text: "Good catch. Let's add that as a blocker. Carol, can you coordinate with DevOps?" },
];

const actions = [
  { title: "Create ticket for token refresh logic", assignee: "Bob", due: "Aug 5", priority: "high", confidence: 94 },
  { title: "Update design system components", assignee: "Carol", due: "Aug 7", priority: "medium", confidence: 91 },
  { title: "Investigate rate limiter on staging", assignee: "Carol", due: "Aug 4", priority: "high", confidence: 87 },
  { title: "Schedule release review meeting", assignee: "Alice", due: "Aug 8", priority: "low", confidence: 72 },
];

export default function MeetingDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/meetings" className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary/50 transition">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sprint Planning Q3</h1>
          <p className="text-xs text-muted-foreground">Aug 3, 2025 · 45 min · Meeting #{id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left — Metadata */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> 45 minutes</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> 8 participants</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Tag className="h-3.5 w-3.5" /> Sprint, Planning, Q3</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Paperclip className="h-3.5 w-3.5" /> 2 attachments</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Participants</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              {["Alice (Host)", "Bob", "Carol", "Dave", "Eve"].map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary">{p[0]}</div>
                  <span className="text-xs">{p}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle — Transcript */}
        <div className="lg:col-span-5">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Transcript</CardTitle>
              <button className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition">
                <Play className="h-3 w-3 text-primary" />
              </button>
            </CardHeader>
            <CardContent className="space-y-1 max-h-[500px] overflow-y-auto">
              {transcript.map((t, i) => (
                <div key={i} className="group rounded-lg px-3 py-2 hover:bg-secondary/30 transition cursor-pointer" tabIndex={0} aria-label={`Transcript, ${t.time} — ${t.speaker}: ${t.text}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground">{t.time}</span>
                    <span className="text-xs font-semibold text-primary">{t.speaker}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right — Summary & Actions */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Team aligned on mobile redesign as the primary Q3 sprint focus. Auth flow API endpoints confirmed ready. 
                Rate limiter issue on staging flagged as a blocker requiring DevOps coordination. Design system updates targeted for mid-week delivery.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-1.5"><CheckSquare className="h-3.5 w-3.5" /> Actions ({actions.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {actions.map((a, i) => (
                <div key={i} className="rounded-lg bg-secondary/30 px-3 py-2.5">
                  <p className="text-sm font-medium">{a.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">{a.assignee}</span>
                    <span className="text-xs text-muted-foreground">· Due {a.due}</span>
                    <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                      a.priority === "high" ? "bg-destructive/15 text-destructive" : a.priority === "medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                    }`}>{a.priority}</span>
                    {a.confidence < 80 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-yellow-400">
                        <AlertTriangle className="h-3 w-3" /> {a.confidence}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
