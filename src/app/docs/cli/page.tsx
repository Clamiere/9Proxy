import type { Metadata } from "next";
import { DocsHeader } from "@/components/docs-header";
import { DocsPagination } from "@/components/docs-pagination";

export const metadata: Metadata = {
  title: "CLI",
};

export default function CLIPage() {
  return (
    <div>
      <DocsHeader
        group="References"
        title="CLI"
        description="Search and manage affiliate programs from your terminal."
      />

      <div className="space-y-3">
        <h2 id="commands" className="text-lg font-semibold mb-3">Commands</h2>
        {[
          {
            cmd: 'npx openaffiliate search "email"',
            desc: "Search programs by keyword",
          },
          {
            cmd: "npx openaffiliate search --category Database --type recurring",
            desc: "Filter by category and commission type",
          },
          {
            cmd: "npx openaffiliate search --min-commission 20 --json",
            desc: "Filter by commission, output as JSON",
          },
          {
            cmd: "npx openaffiliate info stripe",
            desc: "Get full program details",
          },
          {
            cmd: "npx openaffiliate info stripe --json",
            desc: "Get details as JSON (for scripting)",
          },
          {
            cmd: "npx openaffiliate categories",
            desc: "List all categories with program counts",
          },
          {
            cmd: "npx openaffiliate add supabase",
            desc: "Add program to your .openaffiliate.json",
          },
        ].map((item) => (
          <div
            key={item.cmd}
            className="rounded-lg bg-muted/60 dark:bg-zinc-950 border border-border/50 px-4 py-3 overflow-x-auto"
          >
            <code className="text-xs font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
              {item.cmd}
            </code>
            <p className="text-[11px] text-muted-foreground mt-1">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Tip: Use{" "}
        <code className="bg-muted px-1 py-0.5 rounded">--json</code> on any
        command to get machine-readable output for piping into other tools.
      </p>

      <DocsPagination currentPath="/docs/cli" />
    </div>
  );
}
