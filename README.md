# keyforge.cards

Landing pages for keyforge.cards and its subdomains.

## Sites

A single Cloud Run service serves three landing pages via host-based routing.
Each site has its own folder under `src/public/`:

- **keyforge.cards** &ndash; index of KeyForge tools
- **amasser.keyforge.cards** &ndash; the Amasser browser extension
- **bingo.keyforge.cards** &ndash; the KeyForge bingo board generator

## Development

```bash
# Install dependencies and set up git hooks
deno task setup

# Start development server with hot reload
deno task dev

# Type-check
deno task check

# Format and lint
deno task fmt
deno task lint

# Run tests
deno task test
```

Use a `Host` header to preview a subdomain locally, e.g.:

```bash
curl -H "Host: amasser.keyforge.cards" http://localhost:8080/
```
