// Main entry point for keyforge.cards service
import { app } from "./app.ts";

const port = parseInt(Deno.env.get("PORT") || "8080");

console.log(`Starting keyforge.cards service on port ${port}`);

Deno.serve({ port }, app.fetch);
