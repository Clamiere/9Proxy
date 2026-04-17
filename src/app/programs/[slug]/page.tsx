import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Clock,
  DollarSign,
  Copy,
  Terminal,
  Bot,
  GitFork,
  Shield,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { programs, getProgram } from "@/lib/programs";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href="/programs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Programs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-lg font-bold">
              {program.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight">
                  {program.name}
                </h1>
                {program.verified && (
                  <Badge
                    variant="outline"
                    className="text-xs border-emerald-500/30 text-emerald-400"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {program.shortDescription}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {program.url.replace("https://", "")}
                </a>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />
                  {program.stars} stars
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {program.createdAt}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base font-semibold mb-3">About</h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {program.description}
            </div>
          </div>

          {/* Agent Instructions */}
          <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-muted/30">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">AGENTS.md</h2>
              <Badge variant="outline" className="text-[10px] ml-auto">
                For AI Agents
              </Badge>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {program.agentPrompt}
              </p>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Keywords:</p>
                <div className="flex flex-wrap gap-1.5">
                  {program.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Install */}
          <div>
            <h2 className="text-base font-semibold mb-3">Quick install</h2>
            <div className="rounded-lg bg-muted/50 border border-border/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-mono">
                  npx openaffiliate add {program.slug}
                </code>
              </div>
              <button className="p-1.5 hover:bg-muted rounded transition-colors">
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Contribute */}
          <div className="rounded-xl border border-border/40 bg-muted/10 p-5 flex items-start gap-3">
            <GitFork className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold">
                Improve this listing
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                This program is community-maintained. Found outdated info?{" "}
                <a
                  href={`https://github.com/openaffiliate/registry/blob/main/programs/${program.slug}.yaml`}
                  className="text-foreground hover:underline"
                >
                  Edit on GitHub
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Commission card */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
            <h3 className="text-sm font-semibold">Commission</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3" /> Rate
                </span>
                <span className="text-sm font-semibold">
                  {program.commission.rate}%{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    {program.commission.type}
                  </span>
                </span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Cookie
                </span>
                <span className="text-sm font-semibold">
                  {program.cookieDays} days
                </span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3" /> Min payout
                </span>
                <span className="text-sm font-semibold">
                  ${program.payout.minimum}
                </span>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Frequency
                </span>
                <span className="text-sm font-semibold capitalize">
                  {program.payout.frequency}
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <h3 className="text-sm font-semibold mb-3">Category</h3>
            <Badge variant="secondary">{program.category}</Badge>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <h3 className="text-sm font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {program.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Submitted by */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <h3 className="text-sm font-semibold mb-2">Submitted by</h3>
            <p className="text-xs text-muted-foreground">
              @{program.submittedBy}
            </p>
          </div>

          {/* Join */}
          <a
            href={program.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors w-full"
          >
            Join Program
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
