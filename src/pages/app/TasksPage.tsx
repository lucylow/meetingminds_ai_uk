import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, ArrowRight, Filter, Download } from "lucide-react";

const columns = [
  {
    title: "To Do",
    color: "text-muted-foreground",
    tasks: [
      { title: "Draft LinkedIn ad copy", assignee: "Sam", due: "Aug 5", priority: "high", meeting: "Sprint Planning Q3", confidence: 94 },
      { title: "Review model metrics", assignee: "Lena", due: "Aug 6", priority: "medium", meeting: "Stakeholder Sync", confidence: 88 },
    ],
  },
  {
    title: "In Progress",
    color: "text-glow-secondary",
    tasks: [
      { title: "Update API docs", assignee: "Maya", due: "Aug 7", priority: "medium", meeting: "Design Review", confidence: 91 },
      { title: "Fix rate limiter on staging", assignee: "Carol", due: "Aug 4", priority: "high", meeting: "Sprint Planning Q3", confidence: 87 },
    ],
  },
  {
    title: "In Review",
    color: "text-yellow-400",
    tasks: [
      { title: "Design system color tokens PR", assignee: "Carol", due: "Aug 6", priority: "low", meeting: "Design Review", confidence: 95 },
    ],
  },
  {
    title: "Done",
    color: "text-primary",
    tasks: [
      { title: "Create sprint board", assignee: "Alice", due: "Aug 2", priority: "medium", meeting: "Sprint Planning Q3", confidence: 97 },
      { title: "Schedule retro follow-up", assignee: "Sam", due: "Aug 3", priority: "low", meeting: "Incident Retro #42", confidence: 92 },
    ],
  },
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Action items extracted from meetings — Kanban view</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition"><Filter className="h-3.5 w-3.5" /> Filter</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition"><Download className="h-3.5 w-3.5" /> Export</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${col.color}`}>{col.title}</span>
              <span className="text-[10px] bg-secondary rounded-full px-1.5 py-0.5 text-muted-foreground">{col.tasks.length}</span>
            </div>
            <div className="space-y-2">
              {col.tasks.map((t, i) => (
                <Card key={i} className="bg-card border-border cursor-pointer hover:border-primary/30 transition">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{t.title}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[10px] bg-secondary/50 rounded px-1.5 py-0.5 text-muted-foreground">{t.assignee}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{t.due}</span>
                      <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                        t.priority === "high" ? "bg-destructive/15 text-destructive" : t.priority === "medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                      }`}>{t.priority}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">From: {t.meeting}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
