"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search } from "lucide-react";
import { FilterSelect } from "@/components/filter-select";

const PLATFORMS = [
  { value: "all", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "reddit", label: "Reddit" },
  { value: "blog", label: "Blog" },
];

const TIME_RANGES = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const SORT_OPTIONS = [
  { value: "views", label: "Top Views" },
  { value: "likes", label: "Top Likes" },
  { value: "quality", label: "SIFT Score" },
  { value: "recent", label: "Most Recent" },
];

const QUALITY_OPTIONS = [
  { value: "all", label: "All Content" },
  { value: "7", label: "Verified (7+)" },
  { value: "5", label: "Related (5+)" },
  { value: "3", label: "Possible (3+)" },
];

interface ExploreFiltersProps {
  programs: string[];
  platformCounts: Record<string, number>;
  total: number;
}

export function ExploreFilters({
  programs,
  platformCounts,
  total,
}: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const platform = searchParams.get("platform") ?? "all";
  const timeRange = searchParams.get("time") ?? "all";
  const sort = searchParams.get("sort") ?? "quality";
  const program = searchParams.get("program") ?? "";
  const quality = searchParams.get("quality") ?? "3";
  const q = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all" || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      router.replace(`/explore?${params.toString()}`);
    },
    [router, searchParams]
  );

  const totalAll = Object.values(platformCounts).reduce((a, b) => a + b, 0);

  const programOptions = [
    { value: "", label: "All Programs" },
    ...programs.map((p) => ({ value: p, label: p.replace(/-/g, " ") })),
  ];

  return (
    <div className="space-y-4">
      {/* Platform tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {PLATFORMS.map(({ value, label }) => {
          const count =
            value === "all" ? totalAll : (platformCounts[value] ?? 0);
          const isActive = platform === value;
          return (
            <button
              key={value}
              onClick={() => updateParams({ platform: value })}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {label}
              <span
                className={`tabular-nums ${isActive ? "text-background/70" : "text-muted-foreground/60"}`}
              >
                {count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search content..."
            defaultValue={q}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length === 0 || val.length >= 2) {
                updateParams({ q: val });
              }
            }}
            className="w-full rounded-lg border border-border/50 bg-card/50 pl-9 pr-3 py-2 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-border transition-colors"
          />
        </div>

        <FilterSelect
          label="Time"
          value={timeRange}
          onChange={(v) => updateParams({ time: v })}
          options={TIME_RANGES}
        />

        <FilterSelect
          label="Program"
          value={program}
          onChange={(v) => updateParams({ program: v })}
          options={programOptions}
        />

        <FilterSelect
          label="Quality"
          value={quality}
          onChange={(v) => updateParams({ quality: v })}
          options={QUALITY_OPTIONS}
        />

        <FilterSelect
          label="Sort"
          value={sort}
          onChange={(v) => updateParams({ sort: v })}
          options={SORT_OPTIONS}
        />

        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {total.toLocaleString()} results
        </span>
      </div>
    </div>
  );
}
