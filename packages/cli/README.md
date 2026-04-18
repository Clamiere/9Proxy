# openaffiliate

CLI for the [OpenAffiliate](https://openaffiliate.dev) registry. Search and discover affiliate programs from your terminal.

## Install

```bash
npx openaffiliate search "database"
```

Or install globally:

```bash
npm install -g openaffiliate
```

## Commands

```bash
# Search programs
openaffiliate search "email"

# Filter by category and commission type
openaffiliate search --category AI --type recurring

# Get full program details
openaffiliate info stripe

# List all categories
openaffiliate categories

# Add a program to your project (.openaffiliate.json)
openaffiliate add supabase
```

## JSON output (for agents and scripts)

Every command supports `--json` for machine-readable output:

```bash
openaffiliate search "ai" --json
openaffiliate info vercel --json
openaffiliate categories --json
```

This outputs raw JSON — 10-32x cheaper on tokens than MCP for batch operations.

## Environment

| Variable | Default | Description |
|---|---|---|
| `OPENAFFILIATE_API` | `https://openaffiliate.dev` | API base URL |

## Related

- [openaffiliate-mcp](https://www.npmjs.com/package/openaffiliate-mcp) — MCP server for AI agents
- [openaffiliate-sdk](https://www.npmjs.com/package/openaffiliate-sdk) — TypeScript SDK
- [openaffiliate.dev](https://openaffiliate.dev) — Browse the registry

## License

MIT
