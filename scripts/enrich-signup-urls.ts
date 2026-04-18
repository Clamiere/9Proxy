/**
 * Enrich signup_url for programs where it currently points to homepage.
 * Crawls the company homepage to find the actual affiliate/partner page.
 *
 * Usage:
 *   npx tsx scripts/enrich-signup-urls.ts           # dry run (report only)
 *   npx tsx scripts/enrich-signup-urls.ts --write    # update YAML files
 *   npx tsx scripts/enrich-signup-urls.ts --slug vercel  # single program
 */

import * as fs from "fs";
import * as path from "path";

const PROGRAMS_DIR = path.join(__dirname, "..", "programs");

// Keywords that indicate an affiliate/partner page
const AFFILIATE_KEYWORDS = [
  "/affiliate",
  "/affiliates",
  "/partner",
  "/partners",
  "/referral",
  "/refer",
  "/affiliate-program",
  "/partner-program",
  "/referral-program",
  "/become-a-partner",
  "/become-an-affiliate",
  "/ambassador",
  "/reseller",
];

// Patterns to match in link text or href
const LINK_PATTERNS = [
  /affiliat/i,
  /partner(?!s?\.)/i,
  /referral/i,
  /refer-a-friend/i,
  /ambassador/i,
  /reseller/i,
  /become.*(partner|affiliate)/i,
];

interface ProgramData {
  slug: string;
  url: string;
  signup_url: string;
  filePath: string;
}

function loadPrograms(): ProgramData[] {
  const files = fs.readdirSync(PROGRAMS_DIR).filter((f) => f.endsWith(".yaml"));
  const programs: ProgramData[] = [];

  for (const file of files) {
    const filePath = path.join(PROGRAMS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const slugMatch = content.match(/^slug:\s*(.+)$/m);
    const urlMatch = content.match(/^url:\s*(.+)$/m);
    const signupMatch = content.match(/^signup_url:\s*(.+)$/m);

    if (slugMatch && urlMatch && signupMatch) {
      programs.push({
        slug: slugMatch[1].trim(),
        url: urlMatch[1].trim(),
        signup_url: signupMatch[1].trim(),
        filePath,
      });
    }
  }

  return programs;
}

function needsEnrichment(p: ProgramData): boolean {
  const url = p.url.replace(/\/+$/, "").toLowerCase();
  const signup = p.signup_url.replace(/\/+$/, "").toLowerCase();
  return signup === url;
}

async function findAffiliateUrl(
  homepage: string
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(homepage, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();

    // Extract all href values
    const hrefRegex = /href=["']([^"']+)["']/gi;
    const hrefs: string[] = [];
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      hrefs.push(match[1]);
    }

    // Parse base URL for resolving relative URLs
    const baseUrl = new URL(homepage);

    // Score each link
    let bestUrl: string | null = null;
    let bestScore = 0;

    for (const href of hrefs) {
      let fullUrl: string;
      try {
        if (href.startsWith("http")) {
          fullUrl = href;
        } else if (href.startsWith("/")) {
          fullUrl = `${baseUrl.origin}${href}`;
        } else {
          continue;
        }
      } catch {
        continue;
      }

      // Must be same domain or known affiliate platform
      const hrefHost = new URL(fullUrl).hostname.replace("www.", "");
      const baseHost = baseUrl.hostname.replace("www.", "");
      const isSameDomain = hrefHost === baseHost || hrefHost.endsWith(`.${baseHost}`);
      const isKnownPlatform =
        hrefHost.includes("partnerstack") ||
        hrefHost.includes("impact.com") ||
        hrefHost.includes("shareasale") ||
        hrefHost.includes("cj.com") ||
        hrefHost.includes("firstpromoter") ||
        hrefHost.includes("rewardful") ||
        hrefHost.includes("partners.dub.co") ||
        hrefHost.includes("getreditus");

      if (!isSameDomain && !isKnownPlatform) continue;

      const lowerHref = fullUrl.toLowerCase();
      let score = 0;

      // Check URL path for affiliate keywords
      for (const keyword of AFFILIATE_KEYWORDS) {
        if (lowerHref.includes(keyword)) {
          score += 10;
          break;
        }
      }

      // Check against patterns
      for (const pattern of LINK_PATTERNS) {
        if (pattern.test(lowerHref)) {
          score += 5;
          break;
        }
      }

      // Boost known platforms
      if (isKnownPlatform) score += 8;

      // Prefer shorter, cleaner URLs
      if (score > 0 && fullUrl.split("/").length <= 5) score += 2;

      if (score > bestScore) {
        bestScore = score;
        bestUrl = fullUrl;
      }
    }

    return bestUrl;
  } catch {
    return null;
  }
}

function updateYamlFile(filePath: string, newSignupUrl: string): void {
  let content = fs.readFileSync(filePath, "utf-8");
  content = content.replace(
    /^signup_url:\s*.+$/m,
    `signup_url: ${newSignupUrl}`
  );
  fs.writeFileSync(filePath, content, "utf-8");
}

async function main() {
  const args = process.argv.slice(2);
  const writeMode = args.includes("--write");
  const slugFilter = args.find((a) => a !== "--write" && a !== "--slug")
    ? args[args.indexOf("--slug") + 1]
    : null;

  const allPrograms = loadPrograms();
  let toEnrich = allPrograms.filter(needsEnrichment);

  if (slugFilter) {
    toEnrich = toEnrich.filter((p) => p.slug === slugFilter);
  }

  console.log(`\nFound ${toEnrich.length} programs needing signup URL enrichment\n`);

  const results = {
    found: [] as { slug: string; url: string; affiliateUrl: string }[],
    notFound: [] as { slug: string; url: string }[],
    errors: [] as { slug: string; url: string; error: string }[],
  };

  // Process in batches of 5
  const BATCH_SIZE = 5;
  for (let i = 0; i < toEnrich.length; i += BATCH_SIZE) {
    const batch = toEnrich.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (program) => {
      try {
        const affiliateUrl = await findAffiliateUrl(program.url);
        if (affiliateUrl) {
          results.found.push({
            slug: program.slug,
            url: program.url,
            affiliateUrl,
          });
          if (writeMode) {
            updateYamlFile(program.filePath, affiliateUrl);
          }
          console.log(`  ✓ ${program.slug} → ${affiliateUrl}`);
        } else {
          results.notFound.push({ slug: program.slug, url: program.url });
          console.log(`  ✗ ${program.slug} — no affiliate page found`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        results.errors.push({ slug: program.slug, url: program.url, error: msg });
        console.log(`  ! ${program.slug} — error: ${msg}`);
      }
    });
    await Promise.all(promises);

    // Brief pause between batches
    if (i + BATCH_SIZE < toEnrich.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\n--- Results ---`);
  console.log(`Found:     ${results.found.length}`);
  console.log(`Not found: ${results.notFound.length}`);
  console.log(`Errors:    ${results.errors.length}`);

  if (writeMode) {
    console.log(`\n✓ Updated ${results.found.length} YAML files`);
  } else {
    console.log(`\nRun with --write to update YAML files`);
  }

  // Write report
  const reportPath = path.join(__dirname, "..", "enrichment-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report saved to ${reportPath}`);
}

main().catch(console.error);
