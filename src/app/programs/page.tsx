"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProgramLogo } from "@/components/program-logo";
import { programs, categories, searchPrograms } from "@/lib/programs";

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export default function ProgramsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const filtered = useMemo(
    () => searchPrograms(query, selectedCategory),
    [query, selectedCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handleCategory = (cat: string) => {
    setSelectedCategory(selectedCategory === cat ? "" : cat);
    setPage(1);
  };
  const handlePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Programs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {programs.length} affiliate programs — curated, verified, and
          agent-ready
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs, categories, tags..."
            className="pl-9 h-10 bg-muted/50 border-border/50 text-sm focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/40"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setSelectedCategory("");
              setPage(1);
            }}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              !selectedCategory
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + page size */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, filtered.length)} of{" "}
          {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-1">Show</span>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => handlePageSize(size)}
              className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                pageSize === size
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">
              No programs found. Try a different search.
            </p>
          </div>
        ) : (
          paginated.map((program) => (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="glow-card group flex items-center gap-4 rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:border-border hover:bg-card/60"
            >
              <ProgramLogo
                slug={program.slug}
                name={program.name}
                size={44}
                className="shrink-0"
              />

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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                p === currentPage
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* CLI hint */}
      <div className="mt-10 rounded-xl border border-border/40 bg-muted/20 p-6">
        <div>
          <h3 className="text-sm font-semibold">Search from CLI</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Use the CLI to search and filter programs from your terminal or AI
            agent.
          </p>
          <code className="mt-3 block rounded-lg bg-background border border-border/50 px-4 py-2.5 text-xs font-mono text-emerald-400">
            npx openaffiliate search &quot;database&quot; --min-commission 10
            --type recurring
          </code>
        </div>
      </div>
    </div>
  );
}
