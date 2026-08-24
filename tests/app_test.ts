// Basic tests for the keyforge.cards landing page service
import { assertEquals } from "@std/assert";
import { app } from "../src/app.ts";

Deno.test("health endpoint returns OK", async () => {
  const req = new Request("http://localhost/health");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  assertEquals(await res.text(), "OK");
});

Deno.test("apex host serves the keyforge.cards landing page", async () => {
  const req = new Request("http://keyforge.cards/");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  const text = await res.text();
  assertEquals(text.includes("keyforge.cards"), true);
  assertEquals(text.includes("Amasser"), true);
  assertEquals(text.includes("Bingo"), true);
});

Deno.test("amasser host serves the amasser landing page", async () => {
  const req = new Request("http://amasser.keyforge.cards/");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  const text = await res.text();
  assertEquals(text.includes("Amasser"), true);
  assertEquals(text.includes("Master Vault"), true);
});

Deno.test("bingo host serves the bingo landing page", async () => {
  const req = new Request("http://bingo.keyforge.cards/");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  const text = await res.text();
  assertEquals(text.includes("Bingo"), true);
  assertEquals(text.includes("bingo board generator"), true);
});

Deno.test("shared favicon is served", async () => {
  const req = new Request("http://keyforge.cards/favicon.svg");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type")?.includes("svg"), true);
});
