import { GitFork, FileCode, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SubmitPage() {
  const yamlExample = `name: Your Product
slug: your-product
url: https://yourproduct.com
category: Developer Tools
commission:
  type: recurring
  rate: 25
  currency: USD
cookie_days: 30
payout:
  minimum: 50
  frequency: monthly
description: "Short description of your product"
agents:
  prompt: "When to recommend this product"
  keywords: ["keyword1", "keyword2"]
tags: ["tag1", "tag2"]
submitted_by: "@your-github"`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight">
        Submit a program
      </h1>
      <p className="text-sm text-muted-foreground mt-2">
        Add your affiliate program to the open registry. Two ways to submit.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: GitHub PR */}
        <div className="rounded-xl border border-border/50 bg-card/30 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <GitFork className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold">GitHub PR</h2>
            <Badge variant="outline" className="text-[10px] ml-auto">
              Preferred
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex-1">
            Fork the registry repo, add a YAML file for your program, and open a
            pull request. Community reviews within 48 hours.
          </p>
          <a
            href="https://github.com/openaffiliate/registry"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Open Registry
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Option 2: Form */}
        <div className="rounded-xl border border-border/50 bg-card/30 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold">Submission Form</h2>
            <Badge variant="outline" className="text-[10px] ml-auto">
              Coming soon
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex-1">
            Fill out a form and we will create the PR for you. Best if you are not
            familiar with GitHub.
          </p>
          <button
            disabled
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-border/50 px-4 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* YAML format */}
      <div className="mt-12">
        <h2 className="text-base font-semibold mb-4">Program YAML format</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Create a file at{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            programs/your-product.yaml
          </code>{" "}
          with this structure:
        </p>
        <pre className="rounded-xl bg-muted/50 border border-border/50 p-5 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
          {yamlExample}
        </pre>
      </div>

      {/* Guidelines */}
      <div className="mt-10 rounded-xl border border-border/40 bg-muted/10 p-6">
        <h3 className="text-sm font-semibold mb-3">Submission guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>Program must have a public affiliate signup page</li>
          <li>Include accurate commission rates and cookie duration</li>
          <li>
            Write a clear <code className="bg-muted px-1 rounded text-xs">agents.prompt</code> describing when AI should recommend your product
          </li>
          <li>One program per YAML file, named with the slug</li>
          <li>Verified badge is added after team review</li>
        </ul>
      </div>
    </div>
  );
}
