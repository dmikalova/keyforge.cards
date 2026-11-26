// Hono application setup
//
// One Cloud Run service serves two landing pages via host-based routing:
// the apex (keyforge.cards) plus the amasser subdomain. Each site
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
function siteFromUrl(url: string): "amasser" | "keyforge" {
  const subdomain = new URL(url).hostname.split(".")[0];
  if (subdomain === "amasser") return "amasser";
  return "keyforge";
}

// Static assets for the resolved site. serveStatic answers "/" with the
// site's index.html.
app.use(
  "/*",
  (c, next) =>
    serveStatic({ root: `./src/public/${siteFromUrl(c.req.url)}` })(c, next),
);
