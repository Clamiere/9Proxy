#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
var API_BASE = process.env.OPENAFFILIATE_API || "https://openaffiliate.dev";
async function fetchJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
function table(rows, widths) {
  const header = rows[0].map((h, i) => h.padEnd(widths[i])).join("  ");
  const sep = widths.map((w) => "\u2500".repeat(w)).join("\u2500\u2500");
  const body = rows.slice(1).map((row) => row.map((c, i) => c.padEnd(widths[i])).join("  ")).join("\n");
  return `
  ${header}
  ${sep}
  ${body}
`;
}
var program = new Command();
program.name("openaffiliate").description("Search and manage affiliate programs from your terminal").version("0.1.0");
program.command("search [query]").description("Search affiliate programs").option("-c, --category <cat>", "Filter by category").option("-t, --type <type>", "Commission type: recurring, one-time").option("--min-commission <n>", "Minimum commission rate", parseFloat).option("--verified", "Show only verified programs").action(async (query, opts) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (opts.category) params.set("category", opts.category);
  if (opts.type) params.set("type", opts.type);
  if (opts.verified) params.set("verified", "true");
  const data = await fetchJSON(`/api/programs?${params}`);
  let programs = data.programs;
  if (opts.minCommission) {
    programs = programs.filter(
      (p) => p.commission.rate >= opts.minCommission
    );
  }
  if (programs.length === 0) {
    console.log("\n  No programs found.\n");
    return;
  }
  const rows = [
    ["Name", "Commission", "Cookie", "Category", "Verified"],
    ...programs.map((p) => [
      p.name,
      `${p.commission.rate} ${p.commission.type}`,
      `${p.cookieDays}d`,
      p.category,
      p.verified ? "\u2713" : ""
    ])
  ];
  console.log(table(rows, [20, 18, 8, 18, 8]));
  console.log(`  ${programs.length} programs found
`);
});
program.command("info <slug>").description("Get detailed program information").action(async (slug) => {
  const data = await fetchJSON(`/api/programs/${slug}`);
  const p = data;
  console.log(`
  ${p.name}${p.verified ? " \u2713" : ""}
  ${p.shortDescription}
  ${"\u2500".repeat(50)}

  Commission:  ${p.commission.rate}% ${p.commission.type}${p.commissionDuration ? ` (${p.commissionDuration})` : ""}
  Cookie:      ${p.cookieDays} days
  Payout:      $${p.payout.minimum} min / ${p.payout.frequency}
  ${p.payoutMethods ? `Methods:     ${p.payoutMethods.join(", ")}` : ""}
  ${p.approval ? `Approval:    ${p.approval}${p.approvalTime ? ` (${p.approvalTime})` : ""}` : ""}
  ${p.network ? `Network:     ${p.network}` : ""}
  URL:         ${p.url}
  ${p.signupUrl ? `Signup:      ${p.signupUrl}` : ""}

  Tags: ${p.tags.join(", ")}
  ${p.restrictions?.length ? `
  Restrictions:
${p.restrictions.map((r) => `    \u2022 ${r}`).join("\n")}` : ""}

  AGENTS.md:
  ${p.agentPrompt}
  ${p.agentUseCases?.length ? `
  Use cases:
${p.agentUseCases.map((u) => `    \u2022 ${u}`).join("\n")}` : ""}
`);
});
program.command("categories").description("List all program categories").action(async () => {
  const data = await fetchJSON("/api/categories");
  const rows = [
    ["Category", "Programs"],
    ...data.categories.map((c) => [
      c.name,
      c.count.toString()
    ])
  ];
  console.log(table(rows, [25, 10]));
});
program.command("add <slug>").description("Add a program to your project").action(async (slug) => {
  const data = await fetchJSON(`/api/programs/${slug}`);
  const p = data;
  const fs = await import("fs");
  const config = {
    programs: [
      {
        slug: p.slug,
        name: p.name,
        url: p.signupUrl || p.url,
        commission: `${p.commission.rate} ${p.commission.type}`
      }
    ]
  };
  const existing = fs.existsSync(".openaffiliate.json") ? JSON.parse(fs.readFileSync(".openaffiliate.json", "utf8")) : { programs: [] };
  if (existing.programs.some((ep) => ep.slug === slug)) {
    console.log(`
  ${p.name} is already in your project.
`);
    return;
  }
  existing.programs.push(config.programs[0]);
  fs.writeFileSync(
    ".openaffiliate.json",
    JSON.stringify(existing, null, 2) + "\n"
  );
  console.log(`
  Added ${p.name} to .openaffiliate.json
`);
});
program.parse();
