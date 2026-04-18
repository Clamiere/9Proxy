import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { DocsHeader } from "@/components/docs-header";
import { DocsPagination } from "@/components/docs-pagination";

export const metadata: Metadata = {
  title: "MCP Server",
};

export default function MCPPage() {
  return (
    <div>
      <DocsHeader
        group="References"
        title="MCP Server"
        description="Connect AI agents to the registry via Model Context Protocol."
      />

      <div className="space-y-10">
        <section>
          <h2 id="http-transport" className="text-lg font-semibold mb-2">
            HTTP transport (recommended)
          </h2>
          <p className="text-base text-muted-foreground mb-3">
            For Claude.ai, ChatGPT, and remote MCP clients:
          </p>
          <CodeBlock
            label="mcp config"
            code={`{
  "mcpServers": {
    "openaffiliate": {
      "url": "https://openaffiliate.dev/api/mcp"
    }
  }
}`}
          />
        </section>

        <section>
          <h2 id="stdio-transport" className="text-lg font-semibold mb-2">stdio transport</h2>
          <p className="text-base text-muted-foreground mb-3">
            For Claude Code, Cursor, and local tools:
          </p>
          <CodeBlock
            label="mcp config"
            code={`{
  "mcpServers": {
    "openaffiliate": {
      "command": "npx",
      "args": ["-y", "openaffiliate-mcp"]
    }
  }
}`}
          />
        </section>

        <section>
          <h2 id="available-tools" className="text-lg font-semibold mb-3">Available tools</h2>
          <div className="space-y-2">
            {[
              {
                name: "search_programs",
                desc: "Search by query, category, commission type, verified status",
              },
              {
                name: "get_program",
                desc: "Get full program details including agent instructions, restrictions, signup URL",
              },
              {
                name: "list_categories",
                desc: "List all categories with program counts",
              },
            ].map((tool) => (
              <div key={tool.name} className="flex items-start gap-3 text-xs">
                <code className="bg-muted px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400 shrink-0">
                  {tool.name}
                </code>
                <span className="text-muted-foreground">{tool.desc}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <DocsPagination currentPath="/docs/mcp" />
    </div>
  );
}
