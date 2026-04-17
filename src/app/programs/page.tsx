"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProgramLogo } from "@/components/program-logo";
import { programs, categories, searchPrograms } from "@/lib/programs";

export default function ProgramsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filtered = useMemo(
    () => searchPrograms(query, selectedCategory),
    [query, selectedCategory]
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Programs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {programs.length} affiliate programs in the registry
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs, categories, tags..."
            className="pl-9 bg-muted/50 border-border/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("")}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              !selectedCategory
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? "" : cat)
              }
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">
              No programs found. Try a different search.
            </p>
          </div>
        ) : (
          filtered.map((program) => (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:border-border hover:bg-card/60"
            >
              <ProgramLogo slug={program.slug} name={program.name} size={44} className="shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">
                    {program.name}
                  </h3>
                  {program.verified && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 shrink-0"
                    >
                      verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {program.shortDescription}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <Badge variant="secondary" className="text-[11px]">
                  {program.commission.rate}%{" "}
                  {program.commission.type === "recurring"
                    ? "recurring"
                    : "one-time"}
                </Badge>
                <Badge variant="outline" className="text-[11px]">
                  {program.cookieDays}d
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Star className="h-3 w-3" />
                {program.stars}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* CLI hint */}
      <div className="mt-10 rounded-xl border border-border/40 bg-muted/20 p-6">
        <div className="flex items-start gap-3">
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold">Search from CLI</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Use the CLI to search and filter programs from your terminal or AI
              agent.
            </p>
            <code className="mt-3 block rounded-lg bg-background border border-border/50 px-4 py-2.5 text-xs font-mono">
              npx openaffiliate search &quot;database&quot; --min-commission 10
              --type recurring
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
