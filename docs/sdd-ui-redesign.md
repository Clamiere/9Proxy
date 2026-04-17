# OpenAffiliate UI Redesign — System Design Document

> **Version**: 1.0 DRAFT
> **Date**: 2026-04-17
> **Status**: Proposal
> **Author**: Claude + Son Piaz

---

## 1. Research Analysis

### 1.1 Cursor (cursor.com)

| Aspect | Pattern |
|---|---|
| **Palette** | Warm beige/cream background (#F5F3F0), dark charcoal text, black CTAs, orange accent |
| **Typography** | Large serif headings + clean sans-serif body. Confident, editorial feel |
| **Hero** | Bold statement headline, single primary CTA, product mockup below |
| **Social proof** | Horizontal logo strip (Stripe, OpenAI, Linear, NVIDIA, Figma) — monochrome on light cards |
| **Features** | Full-bleed product screenshots paired with text. Alternating layout |
| **Navigation** | Minimal: Logo + 4 items + CTA button. Clean and focused |
| **Premium signals** | Generous whitespace, realistic macOS window frames, warm tones, "applied research" positioning |

**Key takeaway**: Warm, editorial, confident. Product speaks for itself. No visual clutter.

### 1.2 Anthropic (anthropic.com)

| Aspect | Pattern |
|---|---|
| **Palette** | Warm beige/tan (#F0EBE3), black text, black pill CTAs. Almost no color |
| **Typography** | Very large serif display headings with underline accents on keywords. Intellectual feel |
| **Hero** | Two-column: massive headline left + mission statement right. No product screenshot |
| **Content** | "Latest releases" as 3-col card grid with date/category metadata |
| **Footer** | Mega footer with 5 columns of links (Products, Solutions, Resources, Company, Terms) |
| **Navigation** | Logo + 5 items + "Try Claude" dropdown CTA |
| **Premium signals** | Extreme restraint in color, typography-first design, editorial/research aesthetic |

**Key takeaway**: Typography-driven. Trust through restraint. Academic credibility meets modern SaaS.

### 1.3 Comet / Perplexity (perplexity.ai/comet)

| Aspect | Pattern |
|---|---|
| **Palette** | Off-white/cream (#F5F5F0), deep teal accents, warm terracotta/rust geometric shapes |
| **Typography** | Serif headings for elegance, sans-serif body. Premium editorial feel |
| **Hero** | Centered headline, single black pill CTA, geometric circles as visual accents |
| **Features** | "Do anything with Comet" — grid of capability cards with soft shadows |
| **Navigation** | Logo left + single "Download" CTA right. Ultra-minimal |
| **Visual** | Large geometric circles (teal, rust, burgundy) at viewport edges. Organic but modern |
| **Premium signals** | Color restraint, geometric art, serif typography, breathing space |

**Key takeaway**: Art-forward. Geometric shapes as identity. Elegant without being cold.

---

## 2. Current OpenAffiliate Assessment

### What works
- Dark theme is distinctive (all 3 competitors use light themes)
- Content density is good for a registry
- CLI/terminal positioning (`npx openaffiliate search`) is unique and on-brand
- Stats bar (14 Programs, 12 Categories) provides quick overview

### What needs improvement
- **Generic SaaS look** — feels like a template, not a brand
- **No visual identity** — no distinctive shapes, colors, or patterns
- **Hero is flat** — just text + button, no visual hook
- **Cards are monotonous** — all same height, same layout, no hierarchy
- **No social proof** — no "who uses this" or testimonials
- **Favicon-quality logos** — 128px, blurry at larger sizes
- **No personality** — doesn't feel like an "open source community" product
- **"How it works" is boring** — numbered steps with no visuals

---

## 3. Design System Proposal

### 3.1 Design Direction: "Open Terminal"

Concept: **The intersection of open-source developer culture and premium SaaS design.**

Not a Cursor clone (warm/editorial) or Anthropic clone (academic/restrained).
Instead: **dark, technical, but warm** — like a well-configured terminal with good taste.

### 3.2 Color System

```
Background:
  --bg-primary:    #0A0A0B    (near-black, current)
  --bg-elevated:   #141416    (cards, panels)
  --bg-surface:    #1C1C1F    (hover states, inputs)
  --bg-accent:     #222226    (highlighted sections)

Brand:
  --brand-primary: #22C55E    (green — "open source", "go", "active")
  --brand-glow:    #22C55E20  (subtle green glow for borders/shadows)
  --brand-warm:    #F59E0B    (amber accent — warmth, energy)

Text:
  --text-primary:  #FAFAFA    (headings)
  --text-secondary:#A1A1AA    (body, descriptions)
  --text-muted:    #71717A    (metadata, timestamps)

Status:
  --verified:      #22C55E    (green badge)
  --featured:      #F59E0B    (amber/gold)
  --new:           #3B82F6    (blue)
```

### 3.3 Typography

```
Headings:   "Cal Sans" or "Plus Jakarta Sans" — geometric, modern, open-source-friendly
Body:       "Inter" — already standard for dev tools
Mono:       "JetBrains Mono" — for code/CLI elements, terminal aesthetic

Hero:       48-64px, font-weight 700, letter-spacing -0.02em
Section:    28-36px, font-weight 600
Card title: 16-18px, font-weight 600
Body:       14-16px, font-weight 400, line-height 1.6
```

### 3.4 Visual Identity Elements

**1. Grid dots pattern** — subtle dot grid on background (like GitHub's homepage). Reinforces "open" and "structured" registry concept.

**2. Green glow accents** — subtle `box-shadow: 0 0 60px var(--brand-glow)` on key elements. Gives the "terminal cursor" vibe.

**3. Terminal-style elements** — code blocks, command previews, and `$` prompts as first-class UI elements (already have `npx openaffiliate search` — lean into this more).

**4. Card border gradient** — on hover, cards get a subtle green-to-transparent border gradient.

---

## 4. Page Architecture

### 4.1 Homepage Sections (top to bottom)

```
┌─────────────────────────────────────────────┐
│ NAVBAR                                       │
│ Logo  Programs  Docs  Submit    GitHub  CLI  │
├─────────────────────────────────────────────┤
│ HERO                                         │
│ ┌─────────────────────┐  ┌────────────────┐ │
│ │ "The open registry  │  │ Terminal demo  │ │
│ │  of affiliate       │  │ $ npx open...  │ │
│ │  programs"          │  │ > Vercel 30%   │ │
│ │                     │  │ > Dub    30%   │ │
│ │ [Browse] [CLI]      │  │ > Neon   20%   │ │
│ └─────────────────────┘  └────────────────┘ │
├─────────────────────────────────────────────┤
│ SOCIAL PROOF BAR                             │
│ "Integrated by 50+ AI agents and dev tools"  │
│ [Claude] [Cursor] [Windsurf] [Copilot] ...   │
├─────────────────────────────────────────────┤
│ STATS STRIP                                  │
│ 14 Programs · 12 Categories · 0 Stars · ...  │
├─────────────────────────────────────────────┤
│ FEATURED PROGRAMS (3-col grid, redesigned)   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │ HD Logo  │ │ HD Logo  │ │ HD Logo  │     │
│ │ Name  ★3 │ │ Name  ★5 │ │ Name  ★1 │     │
│ │ 30% rec  │ │ 50% rec  │ │ $500 one │     │
│ │ ████░░   │ │ ████████ │ │ ██░░░░░░ │     │
│ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────┤
│ HOW IT WORKS (visual, not just text)         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │ 01       │ │ 02       │ │ 03       │     │
│ │ [icon]   │ │ [icon]   │ │ [icon]   │     │
│ │ Browse   │ │ Integrate│ │ Contribute│     │
│ │ terminal │ │ code     │ │ GitHub   │     │
│ │ mockup   │ │ snippet  │ │ PR mock  │     │
│ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────┤
│ CATEGORIES GRID                              │
│ [Infrastructure] [Dev Tools] [Design] [...]  │
├─────────────────────────────────────────────┤
│ OPEN SOURCE CTA                              │
│ "Built in the open. Contribute on GitHub."   │
│ [Star on GitHub]  [Submit Program]           │
├─────────────────────────────────────────────┤
│ FOOTER                                       │
└─────────────────────────────────────────────┘
```

### 4.2 Key Design Changes

#### Hero: Two-Column with Terminal Demo
- Left: headline + description + 2 CTAs
- Right: **animated terminal mockup** showing `npx openaffiliate search "email"` with live results
- This immediately communicates the dual-interface value prop (web + CLI)

#### Social Proof Bar (NEW)
- Even if agents aren't using it yet, show compatible tools: "Works with Claude, Cursor, Windsurf, Copilot"
- Monochrome logos on dark bg, like Cursor's approach but inverted

#### Featured Programs: Richer Cards
- HD logos (Clearbit Logo API: `https://logo.clearbit.com/{domain}?size=256`)
- Visual commission indicator (progress bar or badge with color)
- Hover: green glow border + slight lift
- "Featured" gold badge for top programs

#### How It Works: With Visuals
- Each step gets a mini mockup:
  - Step 1: Browser screenshot of programs page
  - Step 2: Code snippet showing YAML integration
  - Step 3: GitHub PR screenshot

#### Categories Grid (NEW)
- Pill-shaped category buttons with program count
- Click → filtered programs page

---

## 5. Component Architecture

### New Components Needed

```
src/components/
├── ui/
│   ├── glow-card.tsx        # Card with green glow hover effect
│   ├── terminal-demo.tsx    # Animated terminal mockup for hero
│   ├── logo-strip.tsx       # Social proof logo strip
│   ├── commission-badge.tsx  # Visual commission display
│   ├── category-pill.tsx    # Category filter button
│   └── grid-background.tsx  # Dot grid background pattern
├── program-card.tsx         # Redesigned program card
├── program-logo.tsx         # ✅ Already exists (upgrade logos)
├── featured-section.tsx     # Featured programs section
├── how-it-works.tsx         # Visual how-it-works section
├── stats-bar.tsx            # Stats strip component
└── hero.tsx                 # Two-column hero with terminal
```

### Logo Upgrade Strategy

Replace Google Favicon API with Clearbit Logo API:
```
https://logo.clearbit.com/{domain}?size=256
```
- Returns HD company logos (up to 1024px)
- Free tier available
- Fallback chain: Clearbit → local file → initial letter

---

## 6. Implementation Phases

### Phase 1: Visual Foundation (1 session)
- [ ] Set up design tokens (colors, typography, spacing)
- [ ] Add Cal Sans / Plus Jakarta Sans font
- [ ] Add JetBrains Mono for code elements
- [ ] Create `grid-background.tsx` dot pattern
- [ ] Create `glow-card.tsx` component
- [ ] Upgrade logos to Clearbit HD

### Phase 2: Homepage Redesign (1-2 sessions)
- [ ] Two-column hero with terminal demo
- [ ] Social proof / compatible tools bar
- [ ] Redesigned featured program cards
- [ ] Visual "How it works" section
- [ ] Categories grid section
- [ ] Open source CTA section

### Phase 3: Programs Page Upgrade (1 session)
- [ ] Search with instant filter (client-side)
- [ ] Category filter pills
- [ ] Commission sort/filter
- [ ] Improved card design with HD logos

### Phase 4: Program Detail Page (1 session)
- [ ] Better layout with sidebar
- [ ] Integration code snippets (copy-to-clipboard)
- [ ] Related programs section
- [ ] Commission calculator

### Phase 5: New Pages (1-2 sessions)
- [ ] `/compare` — side-by-side program comparison
- [ ] `/submit` — working submission form
- [ ] `/docs` — better documentation with examples

---

## 7. Design Principles

1. **Dark-first, green-accented** — Own the dark theme. Don't follow competitors into light mode.
2. **Terminal is UI** — CLI and code are first-class citizens, not afterthoughts.
3. **Density over decoration** — Pack useful info into every card. No filler sections.
4. **Community feel** — GitHub stars, contributor count, PR activity visible. Open source DNA.
5. **Speed over animation** — Fast loading, minimal JS. Static generation where possible.

---

## 8. Competitive Positioning Summary

| | Cursor | Anthropic | Comet | **OpenAffiliate (proposed)** |
|---|---|---|---|---|
| Theme | Light/warm | Light/tan | Light/cream | **Dark/technical** |
| Tone | Confident product | Academic trust | Elegant assistant | **Developer community** |
| Visual ID | Product mockups | Typography | Geometric shapes | **Terminal + grid dots** |
| Accent | Orange | Black underlines | Teal/rust circles | **Green glow** |
| CTA style | Dark pill | Dark pill | Dark pill | **Green outline + dark pill** |

OpenAffiliate doesn't compete with these products — but it can learn from their design maturity while carving its own identity as the **developer-native affiliate registry**.
