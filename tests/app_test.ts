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
  assertEquals(text.includes("https://keyfordle.keyforge.cards"), true);
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

// Each host serves its own link preview image, and its page points at it.
const previews = {
  "keyforge.cards": "keyforge",
  "amasser.keyforge.cards": "amasser",
  "bingo.keyforge.cards": "bingo",
};
for (const [host, site] of Object.entries(previews)) {
  Deno.test(`${host} serves its link preview image`, async () => {
    const page = await (await app.fetch(new Request(`http://${host}/`))).text();
    assertEquals(
      page.includes(
        `<meta property="og:image" content="https://${host}/og.jpg"`,
      ),
      true,
    );

    const res = await app.fetch(new Request(`http://${host}/og.jpg`));
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "image/jpeg");
    const want = await Deno.readFile(`./src/public/${site}/og.jpg`);
    assertEquals(new Uint8Array(await res.arrayBuffer()), want);
  });
}

Deno.test("shared favicon is served", async () => {
  const req = new Request("http://keyforge.cards/favicon.svg");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type")?.includes("svg"), true);
});
