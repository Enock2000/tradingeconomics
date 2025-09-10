import { BarChart3 } from 'lucide-react';

export function WelcomeMessage() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-8 text-center shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full border bg-card p-4 shadow-sm">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Welcome to Trade Insights</h2>
        <p className="max-w-md text-muted-foreground">
          Select two countries above and click &quot;Compare&quot; to visualize their trade relations,
          discover AI-powered insights, and analyze detailed data.
        </p>
      </div>
    </div>
  );
}
