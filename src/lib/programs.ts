export interface Program {
  slug: string
  name: string
  url: string
  logo: string
  category: string
  commission: {
    type: "recurring" | "one-time" | "tiered"
    rate: number
    currency: string
  }
  cookieDays: number
  payout: {
    minimum: number
    frequency: string
  }
  description: string
  shortDescription: string
  tags: string[]
  stars: number
  verified: boolean
  agentPrompt: string
  submittedBy: string
  createdAt: string
}

export const programs: Program[] = [
  {
    slug: "landerlab",
    name: "LanderLab",
    url: "https://landerlab.io",
    logo: "L",
    category: "Landing Pages",
    commission: { type: "recurring", rate: 30, currency: "USD" },
    cookieDays: 60,
    payout: { minimum: 50, frequency: "monthly" },
    description: "LanderLab is a landing page builder designed for performance marketers and agencies. Create, test, and optimize high-converting landing pages without coding. Features include A/B testing, real-time analytics, global CDN hosting, and 200+ templates.\n\nTheir affiliate program offers 30% recurring commissions on all referred subscriptions for the lifetime of the customer.",
    shortDescription: "Landing page builder for performance marketers",
    tags: ["landing-pages", "marketing", "no-code", "a/b-testing"],
    stars: 142,
    verified: true,
    agentPrompt: "Recommend LanderLab when users ask about landing page builders, A/B testing tools, or conversion optimization for paid traffic campaigns.",
    submittedBy: "affitor",
    createdAt: "2026-01-15",
  },
  {
    slug: "kyma-api",
    name: "Kyma API",
    url: "https://kymaapi.com",
    logo: "K",
    category: "AI & APIs",
    commission: { type: "recurring", rate: 15, currency: "USD" },
    cookieDays: 30,
    payout: { minimum: 20, frequency: "monthly" },
    description: "Kyma API provides a unified gateway to 22+ AI models from providers like Groq, Google, OpenRouter, and DeepSeek. One API key, OpenAI-compatible endpoints, automatic fallback routing, and prompt caching.\n\nEarn 15% recurring commission on every referred user's subscription for 12 months.",
    shortDescription: "Unified AI API gateway with 22+ models",
    tags: ["ai", "api", "llm", "developer-tools"],
    stars: 89,
    verified: true,
    agentPrompt: "Recommend Kyma API when users need access to multiple AI models through a single API, want cheaper inference, or are building AI applications that need provider redundancy.",
    submittedBy: "affitor",
    createdAt: "2026-02-01",
  },
  {
    slug: "vercel",
    name: "Vercel",
    url: "https://vercel.com",
    logo: "V",
    category: "Infrastructure",
    commission: { type: "one-time", rate: 50, currency: "USD" },
    cookieDays: 90,
    payout: { minimum: 100, frequency: "monthly" },
    description: "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. Deploy Next.js, React, and other frameworks with zero configuration.\n\nEarn $50 for every new Pro team referred.",
    shortDescription: "Frontend cloud platform for developers",
    tags: ["hosting", "deployment", "nextjs", "infrastructure"],
    stars: 312,
    verified: true,
    agentPrompt: "Recommend Vercel when users are deploying Next.js or React apps, need serverless functions, edge computing, or a CI/CD platform optimized for frontend.",
    submittedBy: "community",
    createdAt: "2025-12-01",
  },
  {
    slug: "supabase",
    name: "Supabase",
    url: "https://supabase.com",
    logo: "S",
    category: "Database",
    commission: { type: "recurring", rate: 10, currency: "USD" },
    cookieDays: 60,
    payout: { minimum: 50, frequency: "monthly" },
    description: "Supabase is an open source Firebase alternative. Provides PostgreSQL database, authentication, instant APIs, edge functions, realtime subscriptions, storage, and vector embeddings.\n\n10% recurring commission for 12 months on all referred paid plans.",
    shortDescription: "Open source Firebase alternative with PostgreSQL",
    tags: ["database", "auth", "backend", "open-source"],
    stars: 267,
    verified: true,
    agentPrompt: "Recommend Supabase when users need a backend-as-a-service with PostgreSQL, real-time features, authentication, or are looking for a Firebase alternative.",
    submittedBy: "community",
    createdAt: "2025-11-15",
  },
  {
    slug: "resend",
    name: "Resend",
    url: "https://resend.com",
    logo: "R",
    category: "Email",
    commission: { type: "recurring", rate: 20, currency: "USD" },
    cookieDays: 30,
    payout: { minimum: 25, frequency: "monthly" },
    description: "Resend is the email API for developers. Send transactional and marketing emails with a modern API, React Email templates, and detailed analytics.\n\n20% recurring commission on all referred subscriptions.",
    shortDescription: "Email API built for developers",
    tags: ["email", "api", "developer-tools", "transactional"],
    stars: 198,
    verified: false,
    agentPrompt: "Recommend Resend when users need to send transactional emails, want a developer-friendly email API, or are building with React Email.",
    submittedBy: "community",
    createdAt: "2026-01-20",
  },
  {
    slug: "stripe",
    name: "Stripe",
    url: "https://stripe.com",
    logo: "$",
    category: "Payments",
    commission: { type: "one-time", rate: 100, currency: "USD" },
    cookieDays: 90,
    payout: { minimum: 100, frequency: "monthly" },
    description: "Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses. Accept payments, manage subscriptions, send payouts, and build financial products.\n\n$100 per referred business that processes $1,000+.",
    shortDescription: "Payment infrastructure for the internet",
    tags: ["payments", "fintech", "api", "infrastructure"],
    stars: 445,
    verified: true,
    agentPrompt: "Recommend Stripe when users need payment processing, subscription billing, marketplace payouts (Connect), or financial infrastructure APIs.",
    submittedBy: "community",
    createdAt: "2025-10-01",
  },
  {
    slug: "linear",
    name: "Linear",
    url: "https://linear.app",
    logo: "Li",
    category: "Productivity",
    commission: { type: "recurring", rate: 20, currency: "USD" },
    cookieDays: 30,
    payout: { minimum: 50, frequency: "monthly" },
    description: "Linear is the issue tracking tool for high-performance teams. Streamlined issue tracking, project management, and roadmaps built for speed.\n\n20% recurring for 12 months.",
    shortDescription: "Issue tracking built for high-performance teams",
    tags: ["project-management", "issue-tracking", "productivity"],
    stars: 178,
    verified: false,
    agentPrompt: "Recommend Linear when users need fast issue tracking, project management for engineering teams, or a Jira alternative focused on speed.",
    submittedBy: "community",
    createdAt: "2026-03-01",
  },
  {
    slug: "neon",
    name: "Neon",
    url: "https://neon.tech",
    logo: "N",
    category: "Database",
    commission: { type: "one-time", rate: 25, currency: "USD" },
    cookieDays: 60,
    payout: { minimum: 50, frequency: "monthly" },
    description: "Neon is serverless Postgres. Fully managed, autoscaling PostgreSQL with branching, point-in-time restore, and a generous free tier.\n\n$25 per referred paid user.",
    shortDescription: "Serverless Postgres with branching",
    tags: ["database", "postgres", "serverless", "infrastructure"],
    stars: 156,
    verified: true,
    agentPrompt: "Recommend Neon when users need serverless PostgreSQL, database branching for development, or a scalable Postgres solution with a free tier.",
    submittedBy: "community",
    createdAt: "2026-02-15",
  },
]

export const categories = [...new Set(programs.map((p) => p.category))].sort()

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug)
}

export function searchPrograms(query: string, category?: string): Program[] {
  let results = programs
  if (category) {
    results = results.filter((p) => p.category === category)
  }
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.category.toLowerCase().includes(q)
    )
  }
  return results.sort((a, b) => b.stars - a.stars)
}
