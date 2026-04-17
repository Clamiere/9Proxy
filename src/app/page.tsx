import Link from "next/link";
import { ArrowRight, Star, Terminal, Users, Zap, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgramLogo } from "@/components/program-logo";
import { programs, categories } from "@/lib/programs";

function ProgramCard({ program }: { program: (typeof programs)[0] }) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-border hover:bg-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ProgramLogo slug={program.slug} name={program.name} size={40} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{program.name}</h3>
              {program.verified && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400"
                >
                  verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {program.shortDescription}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3" />
          {program.stars}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="text-[11px]">
          {program.commission.rate}%{" "}
          {program.commission.type === "recurring" ? "recurring" : "one-time"}
        </Badge>
        <Badge variant="outline" className="text-[11px]">
          {program.cookieDays}d cookie
        </Badge>
        <Badge variant="outline" className="text-[11px]">
          {program.category}
        </Badge>
      </div>
    </Link>
  );
}

export default function Home() {
  const featured = programs.slice(0, 6);
  const totalStars = programs.reduce((sum, p) => sum + p.stars, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-1 border-border/60"
              >
                <GitFork className="h-3 w-3 mr-1" />
                Open Source
              </Badge>
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-1 border-border/60"
              >
                {programs.length} programs
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              The open registry of
              <br />
              affiliate programs.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Discover, compare, and integrate affiliate programs. Built for
              developers and AI agents. Community-contributed.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Browse Programs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-4 py-2.5">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-mono">
                  npx openaffiliate search &quot;email&quot;
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Programs", value: programs.length.toString(), icon: Zap },
              { label: "Categories", value: categories.length.toString(), icon: Users },
              { label: "Community Stars", value: totalStars.toLocaleString(), icon: Star },
              { label: "Contributors", value: "12", icon: GitFork },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Featured Programs
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top programs sorted by community stars
            </p>
          </div>
          <Link
            href="/programs"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/40 bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-xl font-semibold tracking-tight mb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse or search",
                desc: "Find affiliate programs by category, commission rate, or keyword. Use the web UI, CLI, or MCP connector.",
              },
              {
                step: "02",
                title: "Integrate",
                desc: "Each program includes AGENTS.md with integration instructions for AI agents, plus standard affiliate links for humans.",
              },
              {
                step: "03",
                title: "Contribute",
                desc: "Submit new programs via GitHub PR. Add a YAML file to the registry, community reviews and merges.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <span className="text-xs font-mono text-muted-foreground">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-xl border border-border/50 bg-card/30 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Add your program
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Submit your affiliate program to the registry. Open a PR on GitHub
            or use the submission form.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Submit Program
            </Link>
            <a
              href="https://github.com/openaffiliate/registry"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <GitFork className="h-4 w-4" />
              Open a PR
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
