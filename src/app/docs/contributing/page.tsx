import type { Metadata } from "next";
import Link from "next/link";
import { DocsHeader } from "@/components/docs-header";
import { DocsPagination } from "@/components/docs-pagination";

export const metadata: Metadata = {
  title: "Contributing",
};

export default function ContributingPage() {
  return (
    <div>
      <DocsHeader
        group="Guides"
        title="Contributing"
        description="How to contribute programs, fixes, and features."
      />

      <h2 id="steps" className="text-lg font-semibold mb-3">Steps</h2>

      <div className="space-y-3 text-sm text-muted-foreground">
        {[
          {
            step: "01",
            content: (
              <>
                Fork{" "}
                <a
                  href="https://github.com/Affitor/open-affiliate"
                  className="text-foreground hover:underline"
                >
                  Affitor/open-affiliate
                </a>
              </>
            ),
          },
          {
            step: "02",
            content: (
              <>
                Create a YAML file in{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                  programs/your-product.yaml
                </code>
              </>
            ),
          },
          {
            step: "03",
            content:
              "Open a pull request. CI validates the schema and verifies your signup URL automatically.",
          },
          {
            step: "04",
            content:
              "Community reviews and merges. Your program appears on the site within minutes.",
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-3">
            <span className="text-xs font-mono text-muted-foreground/50 mt-0.5">
              {item.step}
            </span>
            <p>{item.content}</p>
          </div>
        ))}
      </div>

      <h2 id="web-submission" className="text-lg font-semibold mt-10 mb-3">Web submission</h2>

      <div className="rounded-2xl border border-border/40 bg-muted/10 p-6">
        <p className="text-sm text-muted-foreground">
          Or submit via the web:{" "}
          <Link href="/submit" className="text-foreground hover:underline">
            openaffiliate.dev/submit
          </Link>
        </p>
      </div>

      <DocsPagination currentPath="/docs/contributing" />
    </div>
  );
}
