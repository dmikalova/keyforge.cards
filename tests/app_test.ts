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
  assertEquals(text.includes("Card Gallery"), true);
  assertEquals(text.includes("https://gallery.keyforge.cards"), true);
});

Deno.test("amasser host serves the amasser landing page", async () => {
  const req = new Request("http://amasser.keyforge.cards/");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  const text = await res.text();
  assertEquals(text.includes("Amasser"), true);
  assertEquals(text.includes("Master Vault"), true);
});

// Each host serves its own link preview image, and its page points at it.
const previews = {
  "keyforge.cards": "keyforge",
  "amasser.keyforge.cards": "amasser",
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

// Every host serves the same theme files, so a theme looks the same on every
// site.
for (const host of Object.keys(previews)) {
  for (
    const [file, type] of [["theme.css", "css"], ["theme.js", "javascript"]]
  ) {
    Deno.test(`${host} serves /theme/${file}`, async () => {
      const res = await app.fetch(new Request(`http://${host}/theme/${file}`));
      assertEquals(res.status, 200);
      assertEquals(res.headers.get("content-type")?.includes(type), true);
      const want = await Deno.readTextFile(`./src/public/theme/${file}`);
      assertEquals(await res.text(), want);
    });
  }
}

Deno.test("the landing page loads the theme and has a picker", async () => {
  const page = await (await app.fetch(new Request("http://keyforge.cards/")))
    .text();
  assertEquals(page.includes('<script src="/theme/theme.js"></script>'), true);
  assertEquals(page.includes('href="/theme/theme.css"'), true);
  assertEquals(page.includes("data-theme-picker"), true);
});

// The theme script reads only a cookie that names a known theme.
Deno.test("the theme script lists every theme in the stylesheet", async () => {
  const css = await Deno.readTextFile("./src/public/theme/theme.css");
  const js = await Deno.readTextFile("./src/public/theme/theme.js");
  const names = [...css.matchAll(/\[data-theme="([a-z0-9-]+)"\]/g)].map((m) =>
    m[1]
  );
  assertEquals(names.length > 1, true);
  for (const name of names) {
    assertEquals(js.includes(`["${name}",`), true, name);
  }
});

Deno.test("shared favicon is served", async () => {
  const req = new Request("http://keyforge.cards/favicon.svg");
  const res = await app.fetch(req);

  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type")?.includes("svg"), true);
});
