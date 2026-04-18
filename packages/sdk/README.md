# openaffiliate-sdk

TypeScript SDK for the [OpenAffiliate](https://openaffiliate.dev) registry.

## Install

```bash
npm install openaffiliate-sdk
```

## Usage

```typescript
import { searchPrograms, getProgram, listCategories } from "openaffiliate-sdk";

// Search programs
const programs = await searchPrograms("email", { category: "Marketing" });

// Get program details
const program = await getProgram("stripe");

// List categories
const categories = await listCategories();

// Get all programs
import { allPrograms } from "openaffiliate-sdk";
const all = await allPrograms();
```

### Class-based usage

```typescript
import { OpenAffiliate } from "openaffiliate-sdk";

const oa = new OpenAffiliate();

const results = await oa.search("database", {
  commission_type: "recurring",
  verified_only: true,
});

const program = await oa.get("supabase");
const categories = await oa.categories();
```

### Custom API base

```typescript
const oa = new OpenAffiliate({ apiBase: "http://localhost:3000" });
```

## API

### `searchPrograms(query?, options?)`

Search programs by keyword with optional filters.

- `query` — search keyword
- `options.category` — filter by category
- `options.commission_type` — `"recurring"` | `"one-time"` | `"tiered"`
- `options.verified_only` — only verified programs

### `getProgram(slug)`

Get full program details by slug. Returns `null` if not found.

### `listCategories()`

List all categories with program counts.

### `allPrograms()`

Get all programs in the registry.

## Related

- [openaffiliate](https://www.npmjs.com/package/openaffiliate) — CLI tool
- [openaffiliate-mcp](https://www.npmjs.com/package/openaffiliate-mcp) — MCP server
- [openaffiliate.dev](https://openaffiliate.dev) — Browse the registry

## License

MIT
