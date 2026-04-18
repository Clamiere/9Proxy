import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { DocsHeader } from "@/components/docs-header";
import { DocsPagination } from "@/components/docs-pagination";

export const metadata: Metadata = {
  title: "TypeScript SDK",
};

export default function SDKPage() {
  return (
    <div>
      <DocsHeader
        group="References"
        title="TypeScript SDK"
        description="Typed client for searching and querying programs."
      />

      <div className="space-y-6">
        <section>
          <h2 id="install" className="text-lg font-semibold mb-3">Install</h2>
          <CodeBlock label="install" code="npm install openaffiliate-sdk" />
        </section>

        <section>
          <h2 id="usage" className="text-lg font-semibold mb-3">Usage</h2>
          <CodeBlock
            label="TypeScript"
            code={`import { searchPrograms, getProgram } from "openaffiliate-sdk";

// Search with filters
const results = await searchPrograms("email", {
  commission_type: "recurring",
  category: "Email Marketing",
});

// Get a specific program
const stripe = await getProgram("stripe");
console.log(stripe.commission.rate); // "25%"
console.log(stripe.agentPrompt);     // When to recommend`}
          />
        </section>
      </div>

      <DocsPagination currentPath="/docs/sdk" />
    </div>
  );
}
