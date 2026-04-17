#!/usr/bin/env tsx
/**
 * Download logos for all programs.
 *
 * Tries multiple sources in order:
 *   1. apple-touch-icon from the domain
 *   2. /favicon.ico from the domain (if PNG/ICO, skip tiny ones)
 *   3. Google Favicon API (128px)
 *
 * Saves to public/logos/{slug}.png
 *
 * Usage:
 *   npx tsx scripts/download-logos.ts              # all programs
 *   npx tsx scripts/download-logos.ts stripe        # single program
 *   npx tsx scripts/download-logos.ts --missing     # only programs without logos
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROGRAMS_DIR = join(__dirname, "..", "programs");
const LOGOS_DIR = join(__dirname, "..", "public", "logos");

interface ProgramYaml {
  name: string;
  slug: string;
  url: string;
}

function loadProgram(file: string): ProgramYaml {
  const content = readFileSync(join(PROGRAMS_DIR, file), "utf8");
  return parseYaml(content) as ProgramYaml;
}

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "image/*,*/*",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    return res;
  } catch {
    return null;
  }
}

async function tryAppleTouchIcon(domain: string): Promise<Buffer | null> {
  const urls = [
    `${domain}/apple-touch-icon.png`,
    `${domain}/apple-touch-icon-precomposed.png`,
  ];
  for (const url of urls) {
    const res = await fetchWithTimeout(url);
    if (res && res.ok) {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("image")) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 1000) return buf; // skip tiny placeholders
      }
    }
  }
  return null;
}

async function tryFavicon(domain: string): Promise<Buffer | null> {
  const res = await fetchWithTimeout(`${domain}/favicon.ico`);
  if (res && res.ok) {
    const buf = Buffer.from(await res.arrayBuffer());
    // Only use if reasonably sized (skip tiny 16x16 ICOs)
    if (buf.length > 2000) return buf;
  }
  return null;
}

async function tryGoogleFavicon(domain: string): Promise<Buffer | null> {
  const hostname = new URL(domain).hostname;
  const url = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  const res = await fetchWithTimeout(url);
  if (res && res.ok) {
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 100) return buf;
  }
  return null;
}

async function downloadLogo(program: ProgramYaml): Promise<{ source: string } | null> {
  const outPath = join(LOGOS_DIR, `${program.slug}.png`);
  const domain = program.url.replace(/\/$/, "");

  // 1. Apple touch icon (best quality, usually 180x180)
  const apple = await tryAppleTouchIcon(domain);
  if (apple) {
    writeFileSync(outPath, apple);
    return { source: "apple-touch-icon" };
  }

  // 2. Favicon (if large enough)
  const favicon = await tryFavicon(domain);
  if (favicon) {
    writeFileSync(outPath, favicon);
    return { source: "favicon.ico" };
  }

  // 3. Google Favicon API fallback
  const google = await tryGoogleFavicon(domain);
  if (google) {
    writeFileSync(outPath, google);
    return { source: "google-favicon-api" };
  }

  return null;
}

async function main() {
  if (!existsSync(LOGOS_DIR)) {
    mkdirSync(LOGOS_DIR, { recursive: true });
  }

  const args = process.argv.slice(2);
  const missingOnly = args.includes("--missing");
  const singleSlug = args.find((a) => !a.startsWith("--"));

  let programs: ProgramYaml[];

  if (singleSlug) {
    const file = `${singleSlug}.yaml`;
    if (!existsSync(join(PROGRAMS_DIR, file))) {
      console.error(`Program not found: ${singleSlug}`);
      process.exit(1);
    }
    programs = [loadProgram(file)];
  } else {
    programs = readdirSync(PROGRAMS_DIR)
      .filter((f) => f.endsWith(".yaml"))
      .sort()
      .map(loadProgram);

    if (missingOnly) {
      programs = programs.filter(
        (p) => !existsSync(join(LOGOS_DIR, `${p.slug}.png`))
      );
    }
  }

  console.log(`\nDownloading logos for ${programs.length} program(s)...\n`);

  let success = 0;
  let failed = 0;

  for (const p of programs) {
    process.stdout.write(`  ${p.slug}... `);
    const result = await downloadLogo(p);
    if (result) {
      console.log(`OK (${result.source})`);
      success++;
    } else {
      console.log("FAILED (no logo found)");
      failed++;
    }
  }

  console.log(`\nDone: ${success} downloaded, ${failed} failed.`);
  console.log(`Logos saved to: public/logos/\n`);
}

main();
