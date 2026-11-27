# keyforge.cards

Landing pages for keyforge.cards and its subdomains.

## Sites

A single Cloud Run service serves two landing pages via host-based routing.
Each site has its own folder under `src/public/`:

- **keyforge.cards** &ndash; index of KeyForge tools
- **amasser.keyforge.cards** &ndash; the Amasser browser extension

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

## Themes

A reader can pick a theme: the default theme or one of the KeyForge houses.
The choice is kept in the `kf-theme` cookie on `keyforge.cards`, so every
keyforge.cards site can read it. The themes come from
[mklv-ui](https://github.com/dmikalova/mklv-ui). It makes Material color
schemes and checks each text and border pair against the WCAG 2 contrast
minimums.

- `theme/themes.json` is the source.
- `src/public/theme/theme.css` and `theme.js` are generated. Every host serves
  them at `/theme/`.

Edit `theme/themes.json`, then write the files again (needs Go):

```bash
deno task theme
```

### House seeds

Each house's seed and accent come from its full-color house symbol:

```bash
go run github.com/dmikalova/mklv-ui/cmd/mklv-theme@latest seeds <symbol>
```

The `pick` line of the output gives the seed and the accent. The symbols are
in keyforge-bingo (`internal/web/static/img/bg/<house>.webp`). The Ouboros and
Ironyx Rebels symbols are in keyforge-data (`assets/icons/house/<house>.png`).
The default theme keeps the site's amber seed (`#f5a623`) and its purple
neutral (`#2b1d33`).
