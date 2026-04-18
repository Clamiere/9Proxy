#!/usr/bin/env tsx
/**
 * Auto-enrich a community-submitted program YAML.
 *
 * Fixes common issues and adds missing fields without overwriting
 * contributor-provided content that is already correct.
 *
 * Usage:
 *   npx tsx scripts/enrich-program.ts programs/nudgen.yaml
 *   npx tsx scripts/enrich-program.ts --changed   # enrich only changed files (CI mode)
 *
 * What it does:
 *   1. commission.rate: number → string with "%" (e.g. 10 → "10%")
 *   2. Adds missing defaults: kind, source, last_verified_at
 *   3. Downloads logo if missing from public/logos/
 *   4. Validates against schema enum values
 *   5. Reports what was changed (for PR comment)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROGRAMS_DIR = join(ROOT, "programs");
const LOGOS_DIR = join(ROOT, "public", "logos");
const INDEX_FILE = join(ROOT, "src", "lib", "registry-index.json");

const VALID_CATEGORIES = [
  "AI", "Analytics", "Business Operations", "Communication",
  "Content Management", "CRM", "Customer Support", "Design",
  "Developer Tools", "E-Commerce", "Email Marketing", "Finance",
  "HR & Recruiting", "Infrastructure", "Marketing", "Productivity",
  "SaaS", "Sales", "Security", "Social Media",
];

const VALID_COMMISSION_TYPES = ["recurring", "one-time", "tiered", "hybrid"];
const VALID_APPROVAL = ["auto", "manual", "invite-only"];
const VALID_KINDS = ["affiliate", "referral", "creator-payout", "revenue-share", "cashback", "partner-network"];

interface DedupMatch {
  matched_slug: string;
  match_type: "slug" | "domain" | "alias" | "fuzzy";
  distance?: number;
}

interface EnrichResult {
  file: string;
  slug: string;
  changes: string[];
  errors: string[];
  logoDownloaded: boolean;
  duplicate?: DedupMatch;
}

// ── Dedup helpers ──

interface RegistryIndex {
  by_slug: string[];
  by_domain: Record<string, string>;
  by_alias: Record<string, string>;
}

function loadRegistryIndex(): RegistryIndex | null {
  if (!existsSync(INDEX_FILE)) return null;
  try {
    return JSON.parse(readFileSync(INDEX_FILE, "utf-8"));
  } catch {
    return null;
  }
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function checkDuplicate(slug: string, url: string, index: RegistryIndex): DedupMatch | null {
  // 1. Exact slug match (file already exists on main)
  if (index.by_slug.includes(slug)) {
    return { matched_slug: slug, match_type: "slug" };
  }

  // 2. Domain match
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    if (index.by_domain[domain]) {
      return { matched_slug: index.by_domain[domain], match_type: "domain" };
    }
  } catch {}

  // 3. Alias match
  if (index.by_alias[slug]) {
    return { matched_slug: index.by_alias[slug], match_type: "alias" };
  }

  // 4. Fuzzy match (Levenshtein < 3)
  if (slug.length >= 3) {
    for (const existing of index.by_slug) {
      const d = levenshtein(slug, existing);
      if (d > 0 && d < 3) {
        return { matched_slug: existing, match_type: "fuzzy", distance: d };
      }
    }
  }

  return null;
}

async function downloadLogo(slug: string, url: string): Promise<boolean> {
  if (!existsSync(LOGOS_DIR)) mkdirSync(LOGOS_DIR, { recursive: true });

  const logoPath = join(LOGOS_DIR, `${slug}.png`);
  if (existsSync(logoPath)) return false;

  // Try apple-touch-icon first, then Google Favicon API
  const domain = new URL(url).hostname;
  const sources = [
    `${url.replace(/\/$/, "")}/apple-touch-icon.png`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];

  for (const src of sources) {
    try {
      const res = await fetch(src, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("image")) continue;

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 100) continue; // too small = probably not an image

      writeFileSync(logoPath, buffer);
      return true;
    } catch {
      continue;
    }
  }

  return false;
}

async function enrichProgram(filePath: string): Promise<EnrichResult> {
  const slug = basename(filePath, ".yaml");
  const result: EnrichResult = {
    file: filePath,
    slug,
    changes: [],
    errors: [],
    logoDownloaded: false,
  };

  const raw = readFileSync(filePath, "utf-8");
  const data = parseYaml(raw);

  if (!data || typeof data !== "object") {
    result.errors.push("Invalid YAML");
    return result;
  }

  // 0. Dedup check against existing registry
  const index = loadRegistryIndex();
  if (index && data.url) {
    const dup = checkDuplicate(slug, data.url, index);
    if (dup) {
      result.duplicate = dup;
      if (dup.match_type === "fuzzy") {
        result.errors.push(
          `Possible duplicate: "${slug}" is similar to existing program "${dup.matched_slug}" (distance: ${dup.distance}). Please verify this is a new program.`
        );
      } else {
        result.errors.push(
          `Duplicate detected: "${slug}" already exists in registry (matched by ${dup.match_type} → "${dup.matched_slug}"). If this is an update, modify the existing file instead.`
        );
      }
    }
  }

  // 1. Fix commission.rate: number → string
  if (data.commission?.rate !== undefined) {
    const rate = data.commission.rate;
    if (typeof rate === "number") {
      data.commission.rate = `${rate}%`;
      result.changes.push(`commission.rate: ${rate} → "${rate}%"`);
    } else if (typeof rate === "string" && /^\d+$/.test(rate)) {
      data.commission.rate = `${rate}%`;
      result.changes.push(`commission.rate: "${rate}" → "${rate}%"`);
    }
  }

  // 2. Add kind if missing
  if (!data.kind) {
    data.kind = "affiliate";
    result.changes.push('Added kind: "affiliate"');
  } else if (!VALID_KINDS.includes(data.kind)) {
    result.errors.push(`Invalid kind: "${data.kind}"`);
  }

  // 3. Add source if missing
  if (!data.source) {
    data.source = "community";
    result.changes.push('Added source: "community"');
  }

  // 4. Add last_verified_at if missing
  if (!data.last_verified_at) {
    const today = new Date().toISOString().split("T")[0];
    data.last_verified_at = today;
    result.changes.push(`Added last_verified_at: "${today}"`);
  }

  // 5. Validate category
  if (data.category && !VALID_CATEGORIES.includes(data.category)) {
    result.errors.push(`Invalid category: "${data.category}" — must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  // 6. Validate commission.type
  if (data.commission?.type && !VALID_COMMISSION_TYPES.includes(data.commission.type)) {
    result.errors.push(`Invalid commission.type: "${data.commission.type}"`);
  }

  // 7. Validate approval
  if (data.approval && !VALID_APPROVAL.includes(data.approval)) {
    result.errors.push(`Invalid approval: "${data.approval}"`);
  }

  // 8. Slug must match filename
  if (data.slug !== slug) {
    result.errors.push(`Slug mismatch: file="${slug}.yaml" but slug="${data.slug}"`);
  }

  // 9. Check required fields
  const required = ["name", "slug", "url", "category", "commission", "description", "short_description", "agents"];
  for (const field of required) {
    if (!data[field]) {
      result.errors.push(`Missing required field: ${field}`);
    }
  }

  // 10. Check agents.prompt exists
  if (data.agents && !data.agents.prompt) {
    result.errors.push("Missing agents.prompt");
  }

  // Write back if changes were made
  if (result.changes.length > 0 && result.errors.length === 0) {
    writeFileSync(filePath, stringifyYaml(data, { lineWidth: 0 }));
  }

  // 11. Download logo
  if (data.url) {
    try {
      result.logoDownloaded = await downloadLogo(slug, data.url);
      if (result.logoDownloaded) {
        result.changes.push("Downloaded logo");
      }
    } catch {
      // Non-fatal
    }
  }

  return result;
}

function getChangedFiles(): string[] {
  try {
    const diff = execSync("git diff --name-only HEAD~1 HEAD -- programs/", {
      encoding: "utf-8",
      cwd: ROOT,
    }).trim();
    if (!diff) return [];
    return diff.split("\n").filter((f) => f.endsWith(".yaml"));
  } catch {
    // Fallback for PRs
    try {
      const diff = execSync("git diff --name-only origin/main...HEAD -- programs/", {
        encoding: "utf-8",
        cwd: ROOT,
      }).trim();
      if (!diff) return [];
      return diff.split("\n").filter((f) => f.endsWith(".yaml"));
    } catch {
      return [];
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  let files: string[] = [];

  if (args.includes("--changed")) {
    files = getChangedFiles().map((f) => join(ROOT, f));
  } else if (args.length > 0) {
    files = args.filter((a) => !a.startsWith("--")).map((f) =>
      f.startsWith("/") ? f : join(process.cwd(), f)
    );
  } else {
    console.error("Usage: npx tsx scripts/enrich-program.ts [--changed | file1.yaml ...]");
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("No program files to enrich.");
    process.exit(0);
  }

  const results: EnrichResult[] = [];

  for (const file of files) {
    if (!existsSync(file)) {
      console.warn(`File not found: ${file}`);
      continue;
    }
    const result = await enrichProgram(file);
    results.push(result);

    if (result.changes.length > 0) {
      console.log(`✓ ${result.slug}: ${result.changes.join(", ")}`);
    }
    if (result.errors.length > 0) {
      console.error(`✗ ${result.slug}: ${result.errors.join(", ")}`);
    }
    if (result.changes.length === 0 && result.errors.length === 0) {
      console.log(`· ${result.slug}: no changes needed`);
    }
  }

  // Output JSON for GitHub Actions
  const reportPath = join(ROOT, "enrichment-result.json");
  writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // Exit with error if any validation errors
  const hasErrors = results.some((r) => r.errors.length > 0);
  if (hasErrors) {
    console.error("\nValidation errors found. Fix before merging.");
    process.exit(1);
  }
}

main();
