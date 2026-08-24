// Hono application setup
//
// One Cloud Run service serves three landing pages via host-based routing:
// the apex (keyforge.cards) plus the amasser and bingo subdomains. Each site
// has its own folder under src/public.
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

export const app = new Hono();

// Health check endpoint
app.get("/health", (c) => c.text("OK"));

// Shared favicon across all sites
app.get("/favicon.svg", serveStatic({ path: "./src/public/favicon.svg" }));

// Resolve which site to serve from the request host. Deno.serve builds the
// request URL from the Host header, so the subdomain is available here.
function siteFromUrl(url: string): "amasser" | "bingo" | "keyforge" {
  const subdomain = new URL(url).hostname.split(".")[0];
  if (subdomain === "amasser") return "amasser";
  if (subdomain === "bingo") return "bingo";
  return "keyforge";
}

// Static assets for the resolved site
app.use(
  "/*",
  (c, next) =>
    serveStatic({ root: `./src/public/${siteFromUrl(c.req.url)}` })(c, next),
);

// Fallback to the site's index.html for the root path
app.get(
  "/",
  (c, next) =>
    serveStatic({ path: `./src/public/${siteFromUrl(c.req.url)}/index.html` })(
      c,
      next,
    ),
);
