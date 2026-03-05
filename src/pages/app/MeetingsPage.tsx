import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, ArrowUpRight, Clock, Users, CheckSquare } from "lucide-react";

const meetings = [
  { id: "1", title: "Sprint Planning Q3", date: "Aug 3, 2025", duration: "45 min", participants: 8, actions: 5, confidence: 92, status: "processed" },
  { id: "2", title: "Design Review — Mobile App", date: "Aug 3, 2025", duration: "32 min", participants: 5, actions: 3, confidence: 88, status: "processed" },
  { id: "3", title: "Stakeholder Alignment", date: "Aug 2, 2025", duration: "60 min", participants: 12, actions: 7, confidence: 95, status: "processed" },
  { id: "4", title: "Incident Retro #42", date: "Aug 2, 2025", duration: "28 min", participants: 6, actions: 4, confidence: 79, status: "review" },
  { id: "5", title: "1:1 — Sam & Maya", date: "Aug 1, 2025", duration: "22 min", participants: 2, actions: 2, confidence: 91, status: "processed" },
  { id: "6", title: "Board Update Prep", date: "Aug 1, 2025", duration: "50 min", participants: 4, actions: 6, confidence: 87, status: "processed" },
];

export default function MeetingsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = meetings.find((m) => m.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and review processed meetings</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <input className="h-9 w-full rounded-lg border border-border bg-secondary/30 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40" placeholder="Search meetings…" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition">
          <Filter className="h-3.5 w-3.5" /> Filter
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-2">
          {meetings.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`flex items-center justify-between rounded-lg px-4 py-3.5 cursor-pointer transition ${
                selected === m.id ? "bg-primary/10 border border-primary/30" : "bg-card border border-border hover:bg-secondary/40"
              }`}
            >
              <div>
                <p className="text-sm font-medium">{m.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{m.duration}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{m.participants}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><CheckSquare className="h-3 w-3" />{m.actions}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">{m.date}</span>
                <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                  m.status === "review" ? "bg-yellow-500/15 text-yellow-400" : "bg-primary/15 text-primary"
                }`}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {active ? (
            <Card className="bg-card border-border sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{active.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{active.date} · {active.duration} · {active.participants} participants</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Summary</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Team discussed key priorities, assigned action items, and aligned on delivery timelines. {active.actions} actions extracted with {active.confidence}% average confidence.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Actions ({active.actions})</p>
                  {Array.from({ length: active.actions }).map((_, i) => (
                    <div key={i} className="rounded bg-secondary/30 px-3 py-2 mb-1.5 text-xs text-muted-foreground">
                      Action item {i + 1} — extracted automatically
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">Select a meeting to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
