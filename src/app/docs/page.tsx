import { Terminal, Bot, Globe, GitFork } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Documentation</h1>
      <p className="text-sm text-muted-foreground mt-2">
        How to use OpenAffiliate as a developer, agent builder, or contributor.
      </p>

      <div className="mt-10 space-y-12">
        {/* CLI */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">CLI</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Search and manage affiliate programs from your terminal.
          </p>
          <div className="space-y-3">
            {[
              {
                cmd: "npx openaffiliate search \"email\"",
                desc: "Search programs by keyword",
              },
              {
                cmd: "npx openaffiliate search --category Database",
                desc: "Filter by category",
              },
              {
                cmd: "npx openaffiliate search --min-commission 20 --type recurring",
                desc: "Filter by commission",
              },
              {
                cmd: "npx openaffiliate info stripe",
                desc: "Get program details",
              },
              {
                cmd: "npx openaffiliate add kyma-api",
                desc: "Add program to your project",
              },
            ].map((item) => (
              <div
                key={item.cmd}
                className="rounded-lg bg-muted/50 border border-border/50 px-4 py-3"
              >
                <code className="text-xs font-mono">{item.cmd}</code>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* API */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">API</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Public JSON API. No authentication required.
          </p>
          <div className="space-y-3">
            {[
              {
                method: "GET",
                path: "/api/programs",
                desc: "List all programs (supports ?q=, ?category=, ?type=)",
              },
              {
                method: "GET",
                path: "/api/programs/[slug]",
                desc: "Get program details",
              },
              {
                method: "GET",
                path: "/api/categories",
                desc: "List all categories with counts",
              },
            ].map((item) => (
              <div
                key={item.path}
                className="rounded-lg bg-muted/50 border border-border/50 px-4 py-3 flex items-start gap-3"
              >
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded mt-0.5">
                  {item.method}
                </span>
                <div>
                  <code className="text-xs font-mono">{item.path}</code>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MCP */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">MCP Connector</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Connect AI agents to the registry via Model Context Protocol.
          </p>
          <div className="rounded-lg bg-muted/50 border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-2">
              Add to your MCP config:
            </p>
            <pre className="text-xs font-mono text-muted-foreground leading-relaxed">
{`{
  "mcpServers": {
    "openaffiliate": {
      "url": "https://openaffiliate.dev/api/mcp"
    }
  }
}`}
            </pre>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted-foreground">Available tools:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                <code className="bg-muted px-1 rounded">search_programs</code>{" "}
                - Search by query, category, commission type
              </li>
              <li>
                <code className="bg-muted px-1 rounded">get_program</code> -
                Get full program details including agent instructions
              </li>
              <li>
                <code className="bg-muted px-1 rounded">list_categories</code>{" "}
                - Browse available categories
              </li>
            </ul>
          </div>
        </section>

        {/* Contributing */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <GitFork className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Contributing</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            OpenAffiliate is open source. Contributions welcome.
          </p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="text-xs font-mono text-muted-foreground/50 mt-0.5">
                01
              </span>
              <p>
                Fork{" "}
                <a
                  href="https://github.com/openaffiliate/registry"
                  className="text-foreground hover:underline"
                >
                  openaffiliate/registry
                </a>
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-mono text-muted-foreground/50 mt-0.5">
                02
              </span>
              <p>
                Add your program YAML to{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  programs/
                </code>
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-mono text-muted-foreground/50 mt-0.5">
                03
              </span>
              <p>Open a pull request. CI validates the schema automatically.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-mono text-muted-foreground/50 mt-0.5">
                04
              </span>
              <p>
                Community reviews. Merged programs appear on the site within
                minutes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
