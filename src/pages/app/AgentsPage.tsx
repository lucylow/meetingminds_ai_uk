import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Activity, Clock, CheckCircle, AlertTriangle, Settings } from "lucide-react";

const agents = [
  { name: "Transcription Agent", status: "active", uptime: "99.8%", processed: 1240, avgLatency: "1.2s", errors: 2, description: "Converts audio to text with speaker diarization" },
  { name: "Action Extractor", status: "active", uptime: "99.5%", processed: 980, avgLatency: "0.8s", errors: 5, description: "Identifies action items, assignees, and deadlines" },
  { name: "Summarizer", status: "active", uptime: "99.9%", processed: 1100, avgLatency: "1.5s", errors: 1, description: "Generates concise meeting summaries with key decisions" },
  { name: "Sentiment Analyzer", status: "active", uptime: "98.2%", processed: 870, avgLatency: "0.6s", errors: 8, description: "Detects tone and sentiment shifts in conversations" },
  { name: "Integration Agent", status: "idle", uptime: "97.1%", processed: 650, avgLatency: "2.1s", errors: 12, description: "Routes actions to external tools (Jira, Slack, etc.)" },
  { name: "QA Agent", status: "active", uptime: "99.3%", processed: 420, avgLatency: "1.8s", errors: 3, description: "Answers natural language questions about meetings" },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">AI agent fleet — logs, metrics, and control plane</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
          <Bot className="h-3.5 w-3.5" /> Create Agent
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <Card key={a.name} className="bg-card border-border hover:border-primary/20 transition cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  {a.name}
                </CardTitle>
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                  a.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}>{a.status}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{a.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Processed</p>
                  <p className="text-sm font-semibold">{a.processed.toLocaleString()}</p>
                </div>
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Avg Latency</p>
                  <p className="text-sm font-semibold">{a.avgLatency}</p>
                </div>
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Uptime</p>
                  <p className="text-sm font-semibold">{a.uptime}</p>
                </div>
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Errors</p>
                  <p className={`text-sm font-semibold ${a.errors > 5 ? "text-yellow-400" : ""}`}>{a.errors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
