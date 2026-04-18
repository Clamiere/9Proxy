#!/usr/bin/env tsx
/**
 * Discover and fix affiliate signup URLs for auto-imported programs.
 *
 * For each program with a generic homepage as signup_url, tries common
 * affiliate page URL patterns and verifies them with keyword detection.
 *
 * Usage:
 *   npx tsx scripts/fix-signup-urls.ts                  # dry-run
 *   npx tsx scripts/fix-signup-urls.ts --write           # update YAML files
 *   npx tsx scripts/fix-signup-urls.ts --write --limit=20
 *   npx tsx scripts/fix-signup-urls.ts --remove-unfound  # remove programs with no affiliate page
 *   npx tsx scripts/fix-signup-urls.ts --slug=clickup    # single program
 */

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROGRAMS_DIR = join(__dirname, "..", "programs");
const REPORT_FILE = join(__dirname, "..", "signup-url-report.json");

// ── Common affiliate page URL patterns ──

const AFFILIATE_PATHS = [
  "/affiliates",
  "/affiliate",
  "/affiliate-program",
  "/partner/affiliate",
  "/partners/affiliates",
  "/partners/affiliate",
  "/partner-program",
  "/partners",
  "/referral",
  "/referral-program",
  "/refer",
  "/refer-a-friend",
  "/become-a-partner",
  "/become-an-affiliate",
  "/join-affiliate",
  "/earn",
  "/rewards",
  "/ambassador",
  "/ambassador-program",
  "/reseller",
];

// Keywords that strongly indicate an affiliate/referral program page
const AFFILIATE_KEYWORDS = [
  "affiliate program",
  "referral program",
  "partner program",
  "earn commission",
  "recurring commission",
  "earn up to",
  "per referral",
  "join our affiliate",
  "become an affiliate",
  "become a partner",
  "affiliate dashboard",
  "partner dashboard",
  "cookie duration",
  "cookie days",
  "apply now",
  "sign up as an affiliate",
  "sign up as a partner",
  "revenue share",
  "referral link",
  "affiliate link",
  "tracking link",
  "partnerstack",
  "impact.com",
  "shareasale",
  "rewardful",
  "firstpromoter",
  "tapfiliate",
  "commission junction",
  "refersion",
  "post affiliate pro",
  "tune.com",
  "everflow",
];

// ── Types ──

interface ProgramYaml {
  name: string;
  slug: string;
  url: string;
  signup_url: string;
  submitted_by: string;
  [key: string]: unknown;
}

interface DiscoveryResult {
  slug: string;
  name: string;
  homepage: string;
  old_signup_url: string;
  new_signup_url: string | null;
  status: "found" | "not_found" | "error" | "skipped";
  tried_urls: { url: string; status: number | null; score: number }[];
  best_score: number;
  error?: string;
}

// ── Helpers ──

function loadProgram(file: string): ProgramYaml {
  const content = readFileSync(join(PROGRAMS_DIR, file), "utf8");
  return parseYaml(content) as ProgramYaml;
}

async function fetchPage(
  url: string,
  timeoutMs = 10000
): Promise<{ status: number; text: string; finalUrl: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    const text = await res.text();
    return { status: res.status, text, finalUrl: res.url };
  } catch {
    return null;
  }
}

function scoreAffiliateContent(html: string, url: string): number {
  const lower = html.toLowerCase();
  const urlLower = url.toLowerCase();

  let score = 0;

  // URL path contains affiliate keywords = strong signal
  if (urlLower.includes("affiliate")) score += 5;
  if (urlLower.includes("referral")) score += 4;
  if (urlLower.includes("partner") && !urlLower.includes("partnership"))
    score += 2;

  // Count affiliate keywords in page content
  for (const kw of AFFILIATE_KEYWORDS) {
    if (lower.includes(kw)) score += 2;
  }

  // Commission rate mentions
  const commissionMatches = lower.match(
    /(\d+%\s*(?:commission|recurring|revenue)|\$\d+\s*per\s*(?:referral|signup|sale|lead))/g
  );
  if (commissionMatches) score += commissionMatches.length * 3;

  // Signup/apply forms
  if (lower.includes("apply now") || lower.includes("join now")) score += 2;
  if (lower.includes('type="email"') || lower.includes('type="submit"'))
    score += 1;

  // Negative signals — generic partner pages (consulting/tech/ISV)
  if (lower.includes("technology partner")) score -= 3;
  if (lower.includes("consulting partner")) score -= 3;
  if (lower.includes("solution partner")) score -= 2;
  if (lower.includes("isv partner")) score -= 2;

  return score;
}

async function discoverAffiliateUrl(
  program: ProgramYaml
): Promise<DiscoveryResult> {
  const homepage = program.url.replace(/\/$/, "");
  const tried: DiscoveryResult["tried_urls"] = [];

  // First check if signup_url already has affiliate keywords in URL
  if (
    program.signup_url !== homepage &&
    program.signup_url !== program.url &&
    (program.signup_url.includes("affiliate") ||
      program.signup_url.includes("referral") ||
      program.signup_url.includes("partner"))
  ) {
    return {
      slug: program.slug,
      name: program.name,
      homepage,
      old_signup_url: program.signup_url,
      new_signup_url: null,
      status: "skipped",
      tried_urls: [],
      best_score: 0,
    };
  }

  let bestUrl: string | null = null;
  let bestScore = 0;

  // Try each affiliate path pattern
  for (const path of AFFILIATE_PATHS) {
    const candidateUrl = `${homepage}${path}`;
    const page = await fetchPage(candidateUrl, 8000);

    if (!page) {
      tried.push({ url: candidateUrl, status: null, score: 0 });
      continue;
    }

    // Skip redirects back to homepage
    const finalUrlClean = page.finalUrl.replace(/\/$/, "").split("?")[0].split("#")[0];
    const homepageClean = homepage.replace(/\/$/, "");
    if (finalUrlClean === homepageClean && page.status === 200) {
      tried.push({ url: candidateUrl, status: page.status, score: -1 });
      continue;
    }

    if (page.status >= 400) {
      tried.push({ url: candidateUrl, status: page.status, score: 0 });
      continue;
    }

    const score = scoreAffiliateContent(page.text, page.finalUrl);
    tried.push({ url: candidateUrl, status: page.status, score });

    if (score > bestScore) {
      bestScore = score;
      // Use the final URL (after redirects) — this is the real affiliate page
      bestUrl = page.finalUrl;
    }
  }

  // Also check the homepage itself for an affiliate link
  const homePage = await fetchPage(homepage, 8000);
  if (homePage && homePage.status < 400) {
    // Look for affiliate/referral links in the page HTML
    const linkMatches = homePage.text.match(
      /href=["']([^"']*(?:affiliate|referral|partner)[^"']*)["']/gi
    );
    if (linkMatches) {
      for (const match of linkMatches.slice(0, 5)) {
        const href = match.replace(/^href=["']|["']$/g, "");
        let fullUrl: string;
        if (href.startsWith("http")) {
          fullUrl = href;
        } else if (href.startsWith("/")) {
          fullUrl = `${homepage}${href}`;
        } else {
          continue;
        }

        // Only follow links to the same domain
        try {
          const linkHost = new URL(fullUrl).hostname;
          const homeHost = new URL(homepage).hostname;
          if (!linkHost.includes(homeHost.replace("www.", "")) && !homeHost.includes(linkHost.replace("www.", ""))) {
            continue;
          }
        } catch {
          continue;
        }

        // Check if we already tried this URL
        if (tried.some((t) => t.url === fullUrl)) continue;

        const page = await fetchPage(fullUrl, 8000);
        if (page && page.status < 400) {
          const score = scoreAffiliateContent(page.text, page.finalUrl);
          tried.push({ url: fullUrl, status: page.status, score });
          if (score > bestScore) {
            bestScore = score;
            bestUrl = page.finalUrl;
          }
        }
      }
    }
  }

  // Require minimum score of 6 to consider it a real affiliate page
  if (bestScore >= 6 && bestUrl) {
    return {
      slug: program.slug,
      name: program.name,
      homepage,
      old_signup_url: program.signup_url,
      new_signup_url: bestUrl,
      status: "found",
      tried_urls: tried,
      best_score: bestScore,
    };
  }

  return {
    slug: program.slug,
    name: program.name,
    homepage,
    old_signup_url: program.signup_url,
    new_signup_url: null,
    status: "not_found",
    tried_urls: tried,
    best_score: bestScore,
  };
}

function updateYamlFile(slug: string, newSignupUrl: string): void {
  const filepath = join(PROGRAMS_DIR, `${slug}.yaml`);
  const content = readFileSync(filepath, "utf8");

  // Parse and update
  const data = parseYaml(content);
  data.signup_url = newSignupUrl;
  data.updated_at = new Date().toISOString().split("T")[0];

  const newContent = stringifyYaml(data, {
    lineWidth: 0,
    defaultStringType: "PLAIN",
    defaultKeyType: "PLAIN",
  });
  writeFileSync(filepath, newContent);
}

function removeProgram(slug: string): void {
  const filepath = join(PROGRAMS_DIR, `${slug}.yaml`);
  unlinkSync(filepath);
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const doWrite = args.includes("--write");
  const doRemove = args.includes("--remove-unfound");
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1]) : Infinity;
  const slugArg = args.find((a) => a.startsWith("--slug="));
  const filterSlug = slugArg ? slugArg.split("=")[1] : null;

  // Load only partnerstack-imported programs (or filtered slug)
  const allFiles = readdirSync(PROGRAMS_DIR)
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  let programs: ProgramYaml[] = [];

  for (const file of allFiles) {
    const p = loadProgram(file);
    if (filterSlug && p.slug !== filterSlug) continue;
    // Only process auto-imported programs
    if (!filterSlug && p.submitted_by !== "partnerstack-import") continue;
    programs.push(p);
  }

  programs = programs.slice(0, limit);

  console.log(`\nAffiliate URL Discovery`);
  console.log(`  Programs to check: ${programs.length}`);
  console.log(`  Mode: ${doWrite ? "WRITE" : "DRY-RUN"}`);
  console.log(`  Remove unfound: ${doRemove}\n`);

  const results: DiscoveryResult[] = [];
  let found = 0;
  let notFound = 0;
  let skipped = 0;
  let errors = 0;

  // Process with concurrency limit
  const CONCURRENCY = 5;
  for (let i = 0; i < programs.length; i += CONCURRENCY) {
    const batch = programs.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (p, j) => {
        const idx = i + j + 1;
        process.stdout.write(`  [${idx}/${programs.length}] ${p.slug}... `);

        try {
          const result = await discoverAffiliateUrl(p);
          results.push(result);

          if (result.status === "found") {
            found++;
            console.log(`✅ ${result.new_signup_url}`);
            if (doWrite && result.new_signup_url) {
              updateYamlFile(p.slug, result.new_signup_url);
            }
          } else if (result.status === "skipped") {
            skipped++;
            console.log(`⏭️  already has affiliate URL`);
          } else if (result.status === "not_found") {
            notFound++;
            console.log(`❌ no affiliate page found (best score: ${result.best_score})`);
            if (doWrite && doRemove) {
              removeProgram(p.slug);
              console.log(`    🗑️  removed ${p.slug}.yaml`);
            }
          } else {
            errors++;
            console.log(`⚠️  error: ${result.error}`);
          }

          return result;
        } catch (err) {
          errors++;
          console.log(`⚠️  error: ${err}`);
          return null;
        }
      })
    );
  }

  // Summary
  console.log(`\n${"═".repeat(60)}`);
  console.log("DISCOVERY SUMMARY");
  console.log(`${"═".repeat(60)}\n`);
  console.log(`  ✅ Found affiliate page: ${found}`);
  console.log(`  ⏭️  Already correct: ${skipped}`);
  console.log(`  ❌ No affiliate page: ${notFound}`);
  console.log(`  ⚠️  Errors: ${errors}`);
  console.log(`  Total: ${programs.length}\n`);

  if (!doWrite && found > 0) {
    console.log(`  Run with --write to update YAML files.`);
  }
  if (!doRemove && notFound > 0) {
    console.log(`  Run with --remove-unfound to remove programs without affiliate pages.`);
  }

  // Save report
  const report = {
    generated_at: new Date().toISOString(),
    total: programs.length,
    found,
    not_found: notFound,
    skipped,
    errors,
    results: results.map((r) => ({
      slug: r.slug,
      name: r.name,
      status: r.status,
      old_signup_url: r.old_signup_url,
      new_signup_url: r.new_signup_url,
      best_score: r.best_score,
    })),
  };
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2) + "\n");
  console.log(`\n  Report saved: signup-url-report.json`);
}

main();
